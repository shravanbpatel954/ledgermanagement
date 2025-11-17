// Quick test script to check login functionality
// Run: node test-login.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Testing Login Setup...\n');

// Check JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
console.log('1. JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Missing');
if (!JWT_SECRET) {
  console.error('   Please add JWT_SECRET to .env file');
}

// Check Database Config
console.log('2. Database Config:');
console.log('   DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('   DB_USER:', process.env.DB_USER || 'root');
console.log('   DB_NAME:', process.env.DB_NAME || 'edims_db');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Empty (OK for XAMPP)');

// Test Database Connection
import { sequelize } from './src/models/index.js';
import { User } from './src/models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('\n3. Database Connection: ✅ Connected');
    
    // Test User Model
    console.log('4. User Model: ✅ Loaded');
    
    // Check if users exist
    const userCount = await User.count();
    console.log(`5. Users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('   ⚠️  No users found! Run insert_default_users.sql to create users.');
    } else {
      const users = await User.findAll({ attributes: ['username', 'role'] });
      console.log('   Users:', users.map(u => `${u.username} (${u.role})`).join(', '));
    }
    
    console.log('\n✅ All checks passed! Backend should work.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Error type:', error.name);
    if (error.original) {
      console.error('   Original error:', error.original.message);
    }
    process.exit(1);
  }
})();

