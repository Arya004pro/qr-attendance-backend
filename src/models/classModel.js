/**
 * @file classModel.js
 * @description Defines the Mongoose schema for a Class. This model
 * represents a specific subject or course being taught (e.g., "Data Structures"
 * for "Semester III").
 */

import mongoose from 'mongoose';

/**
 * @schema classSchema
 * @description Schema definition for the Class model.
 */
const classSchema = new mongoose.Schema({
  /**
   * A human-readable class number (e.g., "C-301").
   */
  classNumber: { type: String, required: true },
  /**
   * The official subject code (e.g., "CS-301").
   */
  subjectCode: { type: String, required: true, index: true },
  /**
   * The full name of the subject.
   */
  subjectName: { type: String, required: true },
  /**
   * The year this class belongs to (e.g., "TE").
   */
  classYear: { type: String, required: true },
  /**
   * The semester this class belongs to (e.g., "VII").
   */
  semester: { type: String, required: true },
  /**
   * The student division (e.g., "A", "B").
   */
  division: { type: String, required: true },
  /**
   * Reference to the primary User (teacher) assigned to this class.
   * Not required, allowing for unassigned classes.
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  /**
   * Denormalized teacher name for quick display.
   */
  teacherName: { type: String, required: false },
  /**
   * Reference to the User (Admin) who created this class.
   */
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

/**
 * @model Class
 * @description Mongoose model compiled from the classSchema.
 */
export const Class = mongoose.model('Class', classSchema);