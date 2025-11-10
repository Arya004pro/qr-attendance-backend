/**
 * @file scheduleModel.js
 * @description Defines the Mongoose schema for a Schedule. This model
 * represents a single, manually created, or modified schedule entry,
 * as distinct from a RecurringSchedule template.
 */

import mongoose from 'mongoose';

/**
 * @schema scheduleSchema
 * @description Schema definition for the Schedule model.
 */
const scheduleSchema = new mongoose.Schema({
  /**
   * Reference to the Class this schedule entry is for.
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  /**
   * Reference to the User (teacher) conducting this session.
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  /**
   * The type of session (e.g., lecture, lab).
   */
  sessionType: { type: String, enum: ['lecture', 'lab', 'project'], required: true },
  /**
   * The day of the week for this session.
   */
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  /**
   * Start time in "HH:MM" format.
   */
  startTime: { type: String, required: true }, // Format: "09:00"
  /**
   * End time in "HH:MM" format.
   */
  endTime: { type: String, required: true },   // Format: "10:00"
  /**
   * The room where the session is held.
   */
  roomNumber: { type: String, required: true }, // e.g., "C-204", "E-201"
  /**
   * Whether this schedule entry is active.
   */
  isActive: { type: Boolean, default: true },
  /**
   * The semester this schedule entry applies to.
   */
  semester: { type: String, required: true }, // e.g., "VII"
  /**
   * The academic year this schedule entry applies to.
   */
  academicYear: { type: String, required: true }, // e.g., "2025-26"

  // --- Support for merged sessions ---
  /**
   * Flag indicating if this session is a combination of multiple time slots.
   */
  isMerged: { type: Boolean, default: false },
  /**
   * Array of original TimeSlot IDs that were combined.
   */
  mergedTimeSlots: [{ type: String }],
  /**
   * Custom label for the merged session (e.g., "Lab Session").
   */
  customLabel: { type: String },
  /**
   * Stores details of the original, individual slots before merging.
   */
  originalSlots: [{
    startTime: { type: String },
    endTime: { type: String },
    timeSlotId: { type: String }
  }],
  /**
   * Full time range for the merged session (e.g., "09:00-11:00").
   */
  mergedSessionRange: { type: String },
  /**
   * Link to another Schedule entry if a merged session is split.
   */
  linkedMergedSchedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },

  // --- Template tracking ---
  /**
   * Indicates if this entry was 'manual' or generated from 'recurring'.
   */
  templateSource: { type: String, enum: ['recurring', 'manual'], default: 'manual' },
  /**
   * Reference to the RecurringSchedule this entry was generated from.
   */
  sourceRecurringScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringSchedule' },

  // --- Location ---
  /**
   * GeoJSON location data for the session (e.g., classroom coordinates).
   */
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { timestamps: true });

// --- Indexes ---

/**
 * @index 2dsphere
 * @description Geospatial index for location-based queries.
 */
scheduleSchema.index({ location: '2dsphere' });
/**
 * @index {teacherId: 1, dayOfWeek: 1, startTime: 1}
 * @description Compound index for efficient lookup of a teacher's schedule.
 */
scheduleSchema.index({ teacherId: 1, dayOfWeek: 1, startTime: 1 });

/**
 * @model Schedule
 * @description Mongoose model compiled from the scheduleSchema.
 */
export const Schedule = mongoose.model('Schedule', scheduleSchema);