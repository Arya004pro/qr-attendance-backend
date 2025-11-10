/**
 * @file auditLogModel.js
 * @description Defines the Mongoose schema for an AuditLog. This model
 * is used to record significant actions performed by users for
 * security and compliance.
 */

import mongoose from 'mongoose';

/**
 * @schema auditLogSchema
 * @description Schema definition for the AuditLog model.
 */
const auditLogSchema = new mongoose.Schema({
  /**
   * Reference to the User who performed the action.
   */
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  /**
   * A string describing the action (e.g., "USER_LOGIN", "ATTENDANCE_MANUAL_ENTRY").
   */
  action: { type: String, required: true },
  /**
   * A flexible field to store details about the event (e.g., IP address,
   * affected document IDs, before/after state).
   */
  details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true }); // 'createdAt' timestamp shows when the action occurred

/**
 * @model AuditLog
 * @description Mongoose model compiled from the auditLogSchema.
 */
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);