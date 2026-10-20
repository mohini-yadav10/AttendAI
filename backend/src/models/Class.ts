import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  teacher: mongoose.Types.ObjectId;
  academicYear: string;
  semester?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      minlength: [2, 'Class name must be at least 2 characters'],
      maxlength: [100, 'Class name must not exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Class code is required'],
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// A teacher can only have one class with a given code per academic year
ClassSchema.index({ code: 1, teacher: 1, academicYear: 1 }, { unique: true });
ClassSchema.index({ teacher: 1, archived: 1 });
ClassSchema.index({ name: 'text', code: 'text' });

export const Class = mongoose.model<IClass>('Class', ClassSchema);
