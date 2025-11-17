-- SQL Script to Update Existing Users with Email Addresses
-- Run this in phpMyAdmin to add email addresses to existing users

-- Update admin user with email (connected to username)
UPDATE Users 
SET email = 'shravan.b.patel954@gmail.com' 
WHERE username = 'admin' AND (email IS NULL OR email = '');

-- Update staff user with email (you can change this email)
UPDATE Users 
SET email = 'staff@example.com' 
WHERE username = 'user' AND (email IS NULL OR email = '');

-- Verify the updates
SELECT user_id, username, email, role FROM Users;

-- Note: Make sure to update the staff user email with the actual email address
-- The email should match the user's actual email for password reset to work

