import mongoose, { Document, Schema } from 'mongoose';

export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  status: SessionStatus;
  notes?: string;
  attendanceCaptured: boolean;
  aiServiceUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: [true, 'Session date is required'],
    },
    startTime: {
      type: String,
      match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      match: [/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    attendanceCaptured: {
      type: Boolean,
      default: false,
    },
    aiServiceUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ class: 1, date: -1 });
SessionSchema.index({ teacher: 1, date: -1 });
SessionSchema.index({ status: 1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
