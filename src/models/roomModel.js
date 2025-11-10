/**
 * @file roomModel.js
 * @description Defines the Mongoose schema for a Room. This model
 * represents physical locations like classrooms, labs, etc.
 */

import mongoose from 'mongoose';

/**
 * @schema roomSchema
 * @description Schema definition for the Room model.
 */
const roomSchema = new mongoose.Schema({
  /**
   * The unique identifier for the room (e.g., "C-201", "E-301").
   */
  roomNumber: { type: String, required: true, unique: true },
  /**
   * The type of room.
   */
  type: {
    type: String,
    enum: ['classroom', 'lab', 'auditorium', 'seminar'],
    required: true,
    default: 'classroom'
  },
  /**
   * Whether the room is currently active/usable.
   */
  isActive: { type: Boolean, default: true },
  /**
   * Reference to the User (Admin) who created this room entry.
   */
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// --- Indexes ---

/**
 * @index {type: 1}
 * @description Index for quickly finding rooms of a specific type.
 */
roomSchema.index({ type: 1 });
/**
 * @index {isActive: 1}
 * @description Index for quickly finding all active rooms.
 */
roomSchema.index({ isActive: 1 });

// --- Statics ---

/**
 * @static getActiveRooms
 * @description Static method to find all active rooms, sorted by roomNumber.
 * @returns {Promise<Array<Room>>} A promise resolving to an array of active Room documents.
 */
roomSchema.statics.getActiveRooms = function() {
  return this.find({ isActive: true }).sort({ roomNumber: 1 });
};

/**
 * @static getRoomsByType
 * @description Static method to find all active rooms of a specific type.
 * @param {string} type - The type of room to filter by (e.g., 'lab').
 * @returns {Promise<Array<Room>>} A promise resolving to an array of matching Room documents.
 */
roomSchema.statics.getRoomsByType = function(type) {
  return this.find({ isActive: true, type }).sort({ roomNumber: 1 });
};

/**
 * @model Room
 * @description Mongoose model compiled from the roomSchema.
 */
export const Room = mongoose.model('Room', roomSchema);