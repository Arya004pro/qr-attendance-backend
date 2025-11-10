/**
 * @file classTeacherModel.js
 * @description Defines the Mongoose schema for ClassTeacher. This model
 * creates a many-to-many relationship, linking a Teacher (User)
 * to a Class, often in a "class coordinator" or "primary teacher" role.
 */

import mongoose from 'mongoose';

/**
 * @schema classTeacherSchema
 * @description Schema definition for the ClassTeacher link.
 */
const classTeacherSchema = new mongoose.Schema({
  /**
   * Reference to the Class.
   */
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  /**
   * Reference to the User (Teacher).
   */
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  /**
   * Timestamp of when this assignment was made.
   */
  assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });

/**
 * @model ClassTeacher
 * @description Mongoose model compiled from the classTeacherSchema.
 */
export const ClassTeacher = mongoose.model('ClassTeacher', classTeacherSchema);