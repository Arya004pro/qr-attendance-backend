/**
 * @file recurringScheduleModel.js
 * @description Defines schemas for managing recurring schedules. This file includes:
 * 1. RecurringSchedule: The master template for a class (e.g., "Every Monday 9-10").
 * 2. ScheduleOverride: An exception to the template (e.g., "Cancel 2025-10-27").
 * 3. ScheduleInstance: A single, generated occurrence of the schedule (e.g., "Session on 2025-10-20").
 */

import mongoose from 'mongoose';

// --- 1. Master Recurring Schedule Template ---

/**
 * @schema recurringScheduleSchema
 * @description Schema definition for the RecurringSchedule (master template).
 */
const recurringScheduleSchema = new mongoose.Schema({
  /**
   * Reference to the Class this template is for.
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  /**
   * Reference to the User (teacher) for this template.
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // --- Schedule details ---
  /**
   * A descriptive title for the schedule entry.
   */
  title: { type: String, required: true }, // e.g., "CS201 - BDA Lecture"
  /**
   * The type of session.
   */
  sessionType: { type: String, enum: ['lecture', 'lab', 'project', 'tutorial'], required: true },
  /**
   * The day of the week this template applies to.
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
   * The default room for this recurring session.
   */
  roomNumber: { type: String, required: true },

  // --- Semester configuration ---
  /**
   * The semester this template is for.
   */
  semester: { type: String, required: true }, // e.g., "VII"
  /**
   * The academic year this template is for.
   */
  academicYear: { type: String, required: true }, // e.g., "2025-26"
  /**
   * The date the semester begins (template generation starts here).
   */
  semesterStartDate: { type: Date, required: true },
  /**
   * The date the semester ends (template generation stops here).
   */
  semesterEndDate: { type: Date, required: true },

  // --- Recurrence settings ---
  /**
   * Flag indicating if this schedule recurs.
   */
  isRecurring: { type: Boolean, default: true },
  /**
   * Frequency of recurrence.
   */
  frequency: { type: String, enum: ['weekly', 'biweekly'], default: 'weekly' },

  // --- Status ---
  /**
   * Whether this template is active and should be used for generation.
   */
  isActive: { type: Boolean, default: true },

  // --- Notes and description ---
  description: { type: String },
  notes: { type: String },

  // --- Location ---
  /**
   * Default GeoJSON location for this recurring session.
   */
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { timestamps: true });


// --- 2. Schedule Overrides (Exceptions) ---

/**
 * @schema scheduleOverrideSchema
 * @description Schema definition for ScheduleOverride (exceptions to the template).
 */
const scheduleOverrideSchema = new mongoose.Schema({
  /**
   * Reference to the master RecurringSchedule this override applies to.
   */
  recurringScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringSchedule', required: true },
  /**
   * Reference to the Class (for easy lookup).
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  /**
   * Reference to the User (teacher) (for easy lookup).
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // --- Override date ---
  /**
   * The specific date this override applies to.
   */
  overrideDate: { type: Date, required: true, index: true },

  // --- Override type ---
  /**
   * The nature of the override: 'cancel', 'reschedule', or 'modify'.
   */
  overrideType: {
    type: String,
    enum: ['cancel', 'reschedule', 'modify'],
    required: true
  },

  // --- Modified details (for reschedule/modify) ---
  newStartTime: { type: String }, // New start time if rescheduled
  newEndTime: { type: String },   // New end time if rescheduled
  newRoomNumber: { type: String }, // New room if changed
  newDate: { type: Date }, // New date if rescheduled to different day

  // --- Reason and notes ---
  /**
   * The reason for this override.
   */
  reason: { type: String, required: true }, // e.g., "Holiday", "Makeup class"
  notes: { type: String },

  // --- Status ---
  /**
   * Whether this override is active.
   */
  isActive: { type: Boolean, default: true },
}, { timestamps: true });


// --- 3. Generated Schedule Instances ---

/**
 * @schema scheduleInstanceSchema
 * @description Schema definition for ScheduleInstance (a single, generated occurrence).
 */
const scheduleInstanceSchema = new mongoose.Schema({
  /**
   * Reference to the master RecurringSchedule template.
   */
  recurringScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringSchedule', required: true },
  /**
   * Reference to the ScheduleOverride, if one applies to this instance.
   */
  overrideId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleOverride' },
  /**
   * Reference to the Class (for easy lookup).
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  /**
   * Reference to the User (teacher) (for easy lookup).
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // --- Actual schedule details for this instance ---
  /**
   * The specific date of this class session.
   */
  scheduledDate: { type: Date, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  roomNumber: { type: String, required: true },
  sessionType: { type: String, required: true },

  // --- Status ---
  /**
   * The current status of this specific class instance.
   */
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'completed', 'ongoing'],
    default: 'scheduled'
  },

  // --- Override information ---
  /**
   * Flag indicating if this instance was affected by an override.
   */
  isOverridden: { type: Boolean, default: false },
  originalStartTime: { type: String }, // Stored original time if overridden
  originalEndTime: { type: String },
  originalRoomNumber: { type: String },
  overrideReason: { type: String },

  // --- Attendance tracking ---
  /**
   * Link to the QRCodeSession generated for this class instance.
   */
  attendanceSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCodeSession' },
  /**
   * Flag indicating if attendance has been completed.
   */
  attendanceMarked: { type: Boolean, default: false },
  /**
   * Total number of attendance records for this instance.
   */
  attendanceCount: { type: Number, default: 0 },

  // --- Location ---
  /**
   * The specific GeoJSON location for this instance.
   */
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { timestamps: true });

// --- Indexes ---

// RecurringSchedule
recurringScheduleSchema.index({ teacherId: 1, dayOfWeek: 1, startTime: 1 });
recurringScheduleSchema.index({ classId: 1, isActive: 1 });
recurringScheduleSchema.index({ location: '2dsphere' });

// ScheduleOverride
scheduleOverrideSchema.index({ recurringScheduleId: 1, overrideDate: 1 });
scheduleOverrideSchema.index({ teacherId: 1, overrideDate: 1 });

// ScheduleInstance
scheduleInstanceSchema.index({ teacherId: 1, scheduledDate: 1 });
scheduleInstanceSchema.index({ classId: 1, scheduledDate: 1 });
scheduleInstanceSchema.index({ recurringScheduleId: 1, scheduledDate: 1 });
scheduleInstanceSchema.index({ location: '2dsphere' });

// --- Exports ---

/**
 * @model RecurringSchedule
 * @description Mongoose model for the master recurring schedule template.
 */
export const RecurringSchedule = mongoose.model('RecurringSchedule', recurringScheduleSchema);
/**
 * @model ScheduleOverride
 * @description Mongoose model for schedule exceptions/overrides.
 */
export const ScheduleOverride = mongoose.model('ScheduleOverride', scheduleOverrideSchema);
/**
 * @model ScheduleInstance
 * @description Mongoose model for a single generated schedule occurrence.
 */
export const ScheduleInstance = mongoose.model('ScheduleInstance', scheduleInstanceSchema);