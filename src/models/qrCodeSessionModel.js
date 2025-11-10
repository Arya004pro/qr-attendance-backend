/**
 * @file qrCodeSessionModel.js
 * @description Defines the Mongoose schema for a QRCodeSession. This model
 * manages the active state, rotating tokens, and expiration for a live
 * attendance-marking session.
 */

import mongoose from 'mongoose';

/**
 * @schema qrCodeSessionSchema
 * @description Schema definition for the QRCodeSession model.
 */
const qrCodeSessionSchema = new mongoose.Schema({
  /**
   * Reference to the Class this session is for.
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  /**
   * Reference to the Schedule (or ScheduleInstance) this session corresponds to.
   */
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: false },
  /**
   * Reference to the User (teacher) who initiated this session.
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  /**
   * The main, unique identifier for the entire session.
   */
  sessionId: { type: String, required: true, unique: true },
  /**
   * The current, short-lived, rotating token shown in the QR code.
   */
  currentToken: { type: String, required: true },
  /**
   * Timestamp of when the 'currentToken' was generated.
   */
  tokenGeneratedAt: { type: Date, default: Date.now },
  /**
   * Timestamp of when the entire session should expire and be considered closed.
   */
  sessionExpiresAt: { type: Date, required: true },
  /**
   * The full payload data embedded in the QR code.
   * This is stored for logging and verification.
   */
  qrPayload: {
    classNumber: String,
    subjectCode: String,
    subjectName: String,
    classYear: String,
    semester: String,
    division: String,
    timestamp: Date, // Timestamp of QR code generation
    coordinates: { latitude: Number, longitude: Number }, // Teacher's location
    sessionId: String, // Main session ID
    token: String,     // The current rotating token
  },
  /**
   * Flag indicating if the session is currently active (accepting attendance).
   */
  isActive: { type: Boolean, default: true },
  /**
   * Timestamp of when the session document was created.
   */
  createdAt: { type: Date, default: Date.now },
});

// --- Indexes ---

/**
 * @index {sessionExpiresAt: 1}
 * @description TTL (Time-To-Live) index. This will automatically delete
 * documents from the collection after a buffer period (60s) *only if*
 * the session is marked as `isActive: false`.
 */
qrCodeSessionSchema.index({ sessionExpiresAt: 1 }, {
  expireAfterSeconds: 60, // Give 1 minute buffer
  partialFilterExpression: { isActive: false } // Only apply to inactive sessions
});

/**
 * @index {teacherId: 1, isActive: 1}
 * @description Index for quickly finding all active sessions for a specific teacher.
 */
qrCodeSessionSchema.index({ teacherId: 1, isActive: 1 });
/**
 * @index {tokenGeneratedAt: 1}
 * @description Index to potentially query recent token generations.
 */
qrCodeSessionSchema.index({ tokenGeneratedAt: 1 });

/**
 * @model QRCodeSession
 * @description Mongoose model compiled from the qrCodeSessionSchema.
 */
export const QRCodeSession = mongoose.model('QRCodeSession', qrCodeSessionSchema);