// src/controllers/auth.controller.js
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import { Op } from 'sequelize';
import { actorUserId, recordAudit } from '../utils/auditLog.util.js';

// Note: dotenv.config() is called in server.js before this module is imported
// JWT_SECRET will be read at runtime to ensure it's loaded from .env
// We use a function to get it at runtime instead of module load time
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    console.error('💡 Current env vars:', Object.keys(process.env).filter(k => k.includes('JWT')));
  }
  return secret;
};

const TOKEN_EXPIRES_IN = '5h'; // consistent inactivity window and token lifespan

// --- 1. Register a New User ---
export const register = async (req, res) => {
  try {
    const { username, password, full_name, role, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Create new user (password is auto-hashed by the model's hook)
    const newUser = await User.create({
      username,
      password_hash: password, // Pass the plain password, the hook will hash it
      full_name,
      role,
      email: email || null, // Store email if provided
    });

    const actorId = actorUserId(req) ?? newUser.user_id;
    await recordAudit({
      userId: actorId,
      action_type: 'CREATE',
      module: 'User',
      record_id: newUser.user_id,
      details: {
        username: newUser.username,
        role: newUser.role,
        full_name: newUser.full_name,
      },
    });

    // Optionally issue a token at registration so the user is logged-in immediately
    const JWT_SECRET = getJWTSecret();
    let token = null;
    if (JWT_SECRET) {
      try {
        token = jwt.sign(
          {
            id: newUser.user_id,
            username: newUser.username,
            role: newUser.role,
            lastActivity: Date.now(),
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRES_IN }
        );
      } catch (err) {
        console.error('❌ Error creating token during registration:', err);
        // proceed without failing registration
      }
    }

    const responsePayload = {
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
        email: newUser.email,
      },
    };

    if (token) responsePayload.token = token;

    res.status(201).json(responsePayload);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 1.5. Get All Users (Admin Only) ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'full_name', 'email', 'role'],
      order: [['user_id', 'ASC']],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Login a User ---
export const login = async (req, res) => {
  try {
    console.log('🔐 Login controller called');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Login attempt for username:', username);
    console.log('User model exists:', !!User);

    // Find the user
    let user;
    try {
      user = await User.findOne({ where: { username } });
    } catch (dbError) {
      console.error('❌ Database query error:', dbError);
      throw dbError; // Re-throw to be caught by outer catch
    }
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found, checking password...');

    // Check the password (using the helper method we made in the model)
    let isMatch;
    try {
      isMatch = await user.checkPassword(password);
    } catch (pwdError) {
      console.error('❌ Password check error:', pwdError);
      throw pwdError;
    }
    
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified, creating token...');

    // Update last_login timestamp
    try {
      user.last_login = new Date();
      await user.save();
      console.log('Last login timestamp updated');
    } catch (saveError) {
      console.error('❌ Error saving last_login:', saveError);
      // Don't fail login if save fails, just log it
      console.warn('⚠️  Continuing login despite save error');
    }

    // Get JWT_SECRET at runtime (ensure it's loaded from .env)
    const JWT_SECRET = getJWTSecret();
    
    // Check if JWT_SECRET is set
    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables');
      console.error('💡 Check .env file in edims-backend directory');
      console.error('💡 Current process.env keys:', Object.keys(process.env).filter(k => k.includes('JWT') || k.includes('SECRET')));
      return res.status(500).json({ 
        message: 'Server configuration error', 
        error: 'JWT_SECRET is not configured. Please check backend .env file.' 
      });
    }

    // Create JWT Token
    console.log('Creating JWT token with payload:', {
      id: user.user_id,
      username: user.username,
      role: user.role
    });
    console.log('Using JWT_SECRET (first 5 chars):', JWT_SECRET.substring(0, 5) + '...');
    
    let token;
    try {
      token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
          lastActivity: Date.now(),
        },
        JWT_SECRET,
        {
          expiresIn: TOKEN_EXPIRES_IN,
        }
      );
      console.log('✅ Token created successfully');
    } catch (tokenError) {
      console.error('❌ Token creation error:', tokenError);
      throw tokenError;
    }

    await recordAudit({
      userId: user.user_id,
      action_type: 'LOGIN',
      module: 'Auth',
      record_id: user.user_id,
      details: { username: user.username, role: user.role },
    });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeDatabaseError') {
      console.error('💡 Database connection error! Check if MySQL is running and database exists.');
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: 'Cannot connect to database. Please check if MySQL is running and database exists.',
        details: error.message
      });
    }
    
    if (error.name === 'TypeError' && error.message.includes('Cannot read')) {
      console.error('💡 Model initialization error! Check if User model is properly imported.');
      return res.status(500).json({ 
        message: 'Model initialization error', 
        error: 'User model not properly initialized. Check backend logs.',
        details: error.message
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      errorType: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// --- 3. Forgot Password ---
export const forgotPassword = async (req, res) => {
  try {
    const { usernameOrEmail } = req.body;

    if (!usernameOrEmail) {
      return res.status(400).json({ message: 'Username or email is required' });
    }

    console.log('🔑 Forgot password request for:', usernameOrEmail);

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    });

    // Always return success message (security: don't reveal if user exists)
    if (!user) {
      console.log('User not found for password reset:', usernameOrEmail);
      return res.status(200).json({ 
        message: 'If an account with that username or email exists, a password reset link has been sent.' 
      });
    }

    // Check if user has email
    if (!user.email) {
      console.log('User found but no email set:', user.username);
      return res.status(400).json({ 
        message: 'No email address is associated with this account. Please contact administrator.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to user
    user.reset_token = resetToken;
    user.reset_token_expiry = resetTokenExpiry;
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.username);
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Clear reset token if email fails
      user.reset_token = null;
      user.reset_token_expiry = null;
      await user.save();
      return res.status(500).json({ 
        message: 'Failed to send reset email. Please try again later.' 
      });
    }

    await recordAudit({
      userId: user.user_id,
      action_type: 'REQUEST',
      module: 'Auth',
      record_id: user.user_id,
      details: { action: 'password_reset_email_sent' },
    });

    res.status(200).json({ 
      message: 'If an account with that username or email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// --- 4. Reset Password ---
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ 
        message: 'Token, email, and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('🔐 Reset password request for email:', email);

    // Find user by email and reset token
    const user = await User.findOne({
      where: {
        email: email,
        reset_token: token
      }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Check if token is expired
    if (new Date() > user.reset_token_expiry) {
      // Clear expired token
      user.reset_token = null;
      user.reset_token_expiry = null;
      await user.save();
      return res.status(400).json({ 
        message: 'Reset token has expired. Please request a new one.' 
      });
    }

    // Assign plain password; User.beforeUpdate hashes it once
    user.password_hash = newPassword;

    // Clear reset token
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    console.log('✅ Password reset successful for:', user.username);

    await recordAudit({
      userId: user.user_id,
      action_type: 'UPDATE',
      module: 'User',
      record_id: user.user_id,
      details: { action: 'password_reset_via_token' },
    });

    res.status(200).json({ 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
