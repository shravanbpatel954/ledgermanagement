import jwt from 'jsonwebtoken';
import { AuditLog } from '../models/index.js';

/**
 * Best-effort actor when route omits `protect` but client still sends Bearer (e.g. dev routes).
 */
export function tryGetUserIdFromRequest(req) {
  const auth = req.headers?.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.id ?? null;
  } catch {
    return null;
  }
}

export function actorUserId(req) {
  return req.user?.id ?? tryGetUserIdFromRequest(req) ?? null;
}

/**
 * Write an audit row. Swallows errors so a logging failure never breaks the main request.
 */
export async function recordAudit({
  userId = null,
  action_type,
  module,
  record_id = null,
  details = null,
  transaction,
} = {}) {
  if (!action_type || !module) {
    console.warn('recordAudit: action_type and module are required');
    return;
  }
  try {
    const row = {
      user_id: userId,
      action_type,
      module,
      record_id:
        record_id != null && record_id !== ''
          ? Number(record_id)
          : null,
    };
    if (Number.isNaN(row.record_id)) row.record_id = null;

    if (details != null) {
      row.details =
        typeof details === 'string' ? { summary: details } : details;
    }

    const opts = transaction ? { transaction } : undefined;
    await AuditLog.create(row, opts);
  } catch (err) {
    console.error('recordAudit failed:', err.message);
  }
}
