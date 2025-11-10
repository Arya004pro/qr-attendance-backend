/**
 * @file timeSlotModel.js
 * @description Defines the Mongoose schema for a TimeSlot. This model
 * represents predefined blocks of time for the academic day (e.g., "1st Period").
 */

import mongoose from 'mongoose';

/**
 * @schema timeSlotSchema
 * @description Schema definition for the TimeSlot model.
 */
const timeSlotSchema = new mongoose.Schema({
  /**
   * Display name for the time slot (e.g., "1st Period", "2nd Period").
   */
  name: { type: String, required: true },
  /**
   * Start time of the slot in "HH:MM" 24-hour format.
   */
  startTime: { type: String, required: true }, // Format: "09:00"
  /**
   * End time of the slot in "HH:MM" 24-hour format.
   */
  endTime: { type: String, required: true },   // Format: "10:00"
  /**
   * Type of activity for this slot (e.g., lecture, lab).
   */
  type: {
    type: String,
    enum: ['lecture', 'lab', 'break'],
    required: true
  },
  /**
   * Duration of the slot in minutes, calculated automatically.
   */
  duration: { type: Number },
  /**
   * Whether the time slot is currently active and in use.
   */
  isActive: { type: Boolean, default: true },
  /**
   * The display order of the time slot in a day (e.g., 1 for 1st period).
   */
  order: { type: Number, required: true },
  /**
   * Reference to the Admin/User who created this time slot.
   */
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// --- Indexes ---

/**
 * @index {order: 1}
 * @description Index for sorting time slots by their daily order.
 */
timeSlotSchema.index({ order: 1 });
/**
 * @index {startTime: 1}
 * @description Index for querying time slots by start time.
 */
timeSlotSchema.index({ startTime: 1 });
/**
 * @index {isActive: 1}
 * @description Index for quickly finding all active time slots.
 */
timeSlotSchema.index({ isActive: 1 });

// --- Statics ---

/**
 * @static getActiveSlots
 * @description Static method to find all active time slots,
 * sorted by their 'order' field.
 * @returns {Promise<Array<TimeSlot>>} A promise resolving to an array of active TimeSlot documents.
 */
timeSlotSchema.statics.getActiveSlots = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

// --- Methods ---

/**
 * @method calculateDuration
 * @description Instance method to calculate the duration of the time slot
 * in minutes based on its start and end times.
 * @returns {number} The duration in minutes.
 */
timeSlotSchema.methods.calculateDuration = function() {
  const start = new Date(`2000-01-01T${this.startTime}:00`);
  const end = new Date(`2000-01-01T${this.endTime}:00`);
  return (end - start) / (1000 * 60); // Duration in minutes
};

// --- Middleware (Hooks) ---

/**
 * @function pre-save
 * @description Mongoose pre-save hook to automatically calculate and set
 * the 'duration' field whenever 'startTime' or 'endTime' is modified.
 */
timeSlotSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isModified('endTime')) {
    this.duration = this.calculateDuration();
  }
  next();
});

/**
 * @model TimeSlot
 * @description Mongoose model compiled from the timeSlotSchema.
 */
export const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);