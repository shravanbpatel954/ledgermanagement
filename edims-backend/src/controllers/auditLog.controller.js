import { AuditLog, User } from '../models/index.js';

// --- 1. Get All Audit Logs (Admin Only) ---
export const getAllAuditLogs = async (req, res) => {
  try {
    // Fetch logs and include the User model so we can see the full name of the actor
    const logs = await AuditLog.findAll({
      order: [['createdAt', 'DESC']], // Show newest actions first
      include: [
        { 
          model: User, 
          attributes: ['full_name', 'username'] // Show who did the action
        }
      ],
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};