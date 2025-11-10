/**
 * @file classEnrollmentModel.js
 * @description Defines the Mongoose schema for ClassEnrollment. This model
 * creates a many-to-many relationship, linking a Student (User)
 * to a Class they are enrolled in.
 */

import mongoose from 'mongoose';

/**
 * @schema classEnrollmentSchema
 * @description Schema definition for the ClassEnrollment link.
 */
const classEnrollmentSchema = new mongoose.Schema({
  /**
   * Reference to the Class.
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  /**
   * Reference to the User (Student).
   */
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  /**
   * Timestamp of when the student was enrolled.
   */
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

/**
 * @model ClassEnrollment
 * @description Mongoose model compiled from the classEnrollmentSchema.
 */
export const ClassEnrollment = mongoose.model('ClassEnrollment', classEnrollmentSchema);