# Default Users - SQL Setup

## 🔒 Security Note

For security reasons, default users are created via SQL script instead of a Node.js script. This prevents the script from being accidentally deployed or executed in production.

## 📋 Default Users

### Admin User
- **Username**: `admin`
- **Password**: `1234`
- **Role**: `Admin`

### Staff User
- **Username**: `user`
- **Password**: `123`
- **Role**: `Staff`

## 🚀 How to Create Users

### Using phpMyAdmin (Recommended)

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Select database: `edims_db`
3. Click "SQL" tab
4. Copy and paste contents of `insert_default_users.sql`
5. Click "Go"

### Using MySQL Command Line

```bash
mysql -u root -p edims_db < insert_default_users.sql
```

## ✅ Verification

After running the SQL, you should see:
- 2 rows returned (admin and user)
- Both users with correct roles and hashed passwords

## 🔐 Important

- Passwords are hashed using bcrypt
- The SQL uses `ON DUPLICATE KEY UPDATE` to prevent duplicate inserts
- Change default passwords after first login in production!

