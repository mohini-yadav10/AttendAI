import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  studentId: string; // Unique student identifier (e.g., roll number)
  email?: string;
  phone?: string;
  department?: string;
  year?: number;
  enrolledBy: mongoose.Types.ObjectId; // Teacher who added this student
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 6,
    },
    enrolledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

StudentProfileSchema.index({ studentId: 1 }, { unique: true });
StudentProfileSchema.index({ name: 'text', studentId: 'text', email: 'text' });
StudentProfileSchema.index({ enrolledBy: 1 });
StudentProfileSchema.index({ isActive: 1 });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
