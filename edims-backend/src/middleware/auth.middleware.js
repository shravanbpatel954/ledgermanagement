// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

// Get JWT_SECRET at runtime to ensure it's loaded from .env
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    console.error('💡 Check .env file in edims-backend directory');
  }
  return secret;
};
// --- SESSION CONFIG ---
const SESSION_DURATION = "5h";         // Session lasts max 5 hours
const INACTIVITY_LIMIT = 20 * 60 * 1000; // Auto logout if inactive for 20 mins (change as required)

// --- 1. Authentication Middleware ---
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, getJWTSecret());

      const now = Date.now();

      // --- INACTIVITY LOGOUT CHECK ---
      if (decoded.lastActivity && now - decoded.lastActivity > INACTIVITY_LIMIT) {
        return res.status(440).json({
          message: "Session expired due to inactivity"
        });
      }

      // --- REFRESH TOKEN (rolling session) ---
      const { iat, exp, ...payload } = decoded;
      payload.lastActivity = now;

      const refreshedToken = jwt.sign(payload, getJWTSecret(), {
        expiresIn: SESSION_DURATION,
      });

      res.setHeader("x-refreshed-token", refreshedToken);

      req.user = payload;

      next();

    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


// --- 2. Role-Checking Middleware ---
// This is a *second* middleware we can use *after* `protect`
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, Admin role required' });
  }
};
