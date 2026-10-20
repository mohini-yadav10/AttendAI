import mongoose, { Document, Schema } from 'mongoose';

export type EnrollmentStatus = 'active' | 'inactive' | 'graduated' | 'dropped';

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'dropped'],
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment: same student in same class
EnrollmentSchema.index({ student: 1, class: 1 }, { unique: true });
EnrollmentSchema.index({ class: 1, status: 1 });
EnrollmentSchema.index({ student: 1, status: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
