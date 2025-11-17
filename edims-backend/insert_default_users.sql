-- SQL Script to Insert Default Users
-- Run this once in phpMyAdmin or MySQL to create default users
-- This is more secure than having a script file

-- Insert Admin User
-- Username: admin, Password: 1234
INSERT INTO Users (username, password_hash, full_name, role, created_at)
VALUES (
  'admin',
  '$2b$10$MnHvtzxGGoqDInAYNHwPbO0.la/dH/LivaXYBuKVJIOvUul57E8fC',
  'Administrator',
  'Admin',
  NOW()
)
ON DUPLICATE KEY UPDATE username = username; -- Skip if admin already exists

-- Insert Staff User
-- Username: user, Password: 123
INSERT INTO Users (username, password_hash, full_name, role, created_at)
VALUES (
  'user',
  '$2b$10$DtXSsSKcAmpAvT5mseXG6.WGwT2KnRIRI.E/HOAgzCml8SNkoXkJy',
  'Staff User',
  'Staff',
  NOW()
)
ON DUPLICATE KEY UPDATE username = username; -- Skip if user already exists

-- Verify users were created
SELECT user_id, username, full_name, role, created_at FROM Users WHERE username IN ('admin', 'user');

