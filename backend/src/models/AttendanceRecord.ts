import mongoose, { Document, Schema } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type EntryMethod = 'manual' | 'ai_assisted' | 'ai_reviewed' | 'bulk_import';

export interface ICorrectionEntry {
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  correctedBy: mongoose.Types.ObjectId;
  correctedAt: Date;
  reason?: string;
}

export interface IAttendanceRecord extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  status: AttendanceStatus;
  entryMethod: EntryMethod;
  aiReviewed: boolean;
  aiConfidence?: number; // 0-1, only set when AI was used
  confirmedBy?: mongoose.Types.ObjectId; // Teacher who confirmed
  confirmedAt?: Date;
  correctionHistory: ICorrectionEntry[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CorrectionEntrySchema = new Schema<ICorrectionEntry>(
  {
    previousStatus: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    newStatus: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    correctedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    correctedAt: {
      type: Date,
      default: Date.now,
    },
    reason: String,
  },
  { _id: false }
);

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    entryMethod: {
      type: String,
      enum: ['manual', 'ai_assisted', 'ai_reviewed', 'bulk_import'],
      default: 'manual',
    },
    aiReviewed: {
      type: Boolean,
      default: false,
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    confirmedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    confirmedAt: Date,
    correctionHistory: [CorrectionEntrySchema],
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: One record per student per session — prevents duplicates
AttendanceRecordSchema.index({ student: 1, session: 1 }, { unique: true });
AttendanceRecordSchema.index({ session: 1, status: 1 });
AttendanceRecordSchema.index({ student: 1, class: 1, createdAt: -1 });
AttendanceRecordSchema.index({ class: 1, createdAt: -1 });

export const AttendanceRecord = mongoose.model<IAttendanceRecord>(
  'AttendanceRecord',
  AttendanceRecordSchema
);
