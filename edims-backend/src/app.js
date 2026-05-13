import express from 'express';
import cors from 'cors';
// Import ONLY sequelize from the new index file
import { sequelize } from './models/index.js';

// --- 1. Import Models (to sync them) ---
// We no longer import models here. 'sequelize.sync()' will find them.

// --- 2. Import Routes ---
import authRoutes from './routes/auth.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import itemRoutes from './routes/item.routes.js';
import departmentRoutes from './routes/department.routes.js';
import purchaseOrderRoutes from './routes/purchaseOrder.routes.js';
import challanRoutes from './routes/challan.routes.js';
import billRoutes from './routes/bill.routes.js';
import stockIssueRoutes from './routes/stockIssue.routes.js';
import reportRoutes from './routes/report.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';

// --- 1b. DEFINE MODEL ASSOCIATIONS ---
// THIS SECTION IS NOW REMOVED (it lives in src/models/index.js)

// --- 3. Environment variables ---
// Loaded via import './loadEnv.js' in server.js before this module. If you import
// app.js from another entrypoint, import ./loadEnv.js (or dotenv.config) first.

// --- 4. Initialize Express App ---
const app = express();

// --- 5. Core Middleware ---
// CORS configuration - allow requests from React app
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    console.log('📥 Incoming login request:');
    console.log('   Method:', req.method);
    console.log('   Path:', req.path);
    console.log('   Body:', req.body);
    console.log('   Headers:', {
      'content-type': req.headers['content-type'],
      'origin': req.headers.origin
    });
  }
  next();
});

// --- 6. API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/stock-issues', stockIssueRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// --- 7. Basic Test Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the EDIMS backend API!' });
});

// Test route for items endpoint
app.get('/api/test-items', (req, res) => {
  res.json({ message: 'Items API endpoint is accessible', timestamp: new Date().toISOString() });
});

// Test route for auth endpoint
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoint is accessible', 
    body: req.body,
    timestamp: new Date().toISOString() 
  });
});

// --- 8. Database Sync Function ---
export const connectToDatabase = async () => {
  // Validate environment variables before attempting connection
  const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_HOST'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('💡 Please check your .env file in the edims-backend directory.');
    console.error('💡 Required variables: DB_NAME, DB_USER, DB_HOST');
    return; // Exit early if env vars are missing
  }
  
  try {
    // This authenticates the connection
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // sequelize.sync() now knows about ALL models and associations
    await sequelize.sync({ alter: true });
    console.log('🔄 All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    
    // Provide helpful error messages
    if (error.original) {
      const errCode = error.original.code;
      const errMsg = error.original.sqlMessage || error.original.message;
      
      if (errCode === 'ER_BAD_DB_ERROR' || errMsg?.includes("Unknown database")) {
        console.error('\n💡 DATABASE DOES NOT EXIST!');
        console.error('📝 Please create the database first:');
        console.error('   1. Open phpMyAdmin: http://localhost/phpmyadmin');
        console.error('   2. Click "New" and create database: edims_db');
        console.error('   3. Or run: CREATE DATABASE edims_db;');
        console.error('\n📖 See XAMPP_SETUP.md for detailed instructions.\n');
      } else if (errCode === 'ER_ACCESS_DENIED_ERROR') {
        console.error('\n💡 DATABASE ACCESS DENIED!');
        console.error('📝 Check your .env file credentials:');
        console.error('   - DB_USER (usually "root" for XAMPP)');
        console.error('   - DB_PASSWORD (usually empty "" for XAMPP)');
        console.error('   - Make sure MySQL is running in XAMPP\n');
      } else if (errCode === 'ECONNREFUSED' || errMsg?.includes("connect")) {
        console.error('\n💡 CANNOT CONNECT TO MYSQL SERVER!');
        console.error('📝 Make sure:');
        console.error('   - MySQL is running in XAMPP Control Panel');
        console.error('   - DB_HOST is correct (localhost or 127.0.0.1)');
        console.error('   - MySQL port 3306 is not blocked\n');
      }
    }
    
    // Don't exit - let the server start anyway (for development)
    // In production, you might want to exit the process
    // process.exit(1);
  }
};

// --- 9. Export the App ---
export default app;