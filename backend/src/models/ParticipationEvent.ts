import mongoose, { Document, Schema } from 'mongoose';

export type ParticipationEventType =
  | 'check_in'
  | 'question_submitted'
  | 'poll_response'
  | 'quiz_completed'
  | 'teacher_confirmed';

export interface IParticipationEvent extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  eventType: ParticipationEventType;
  note?: string;
  recordedBy: mongoose.Types.ObjectId; // Teacher or system
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipationEventSchema = new Schema<IParticipationEvent>(
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
    eventType: {
      type: String,
      enum: ['check_in', 'question_submitted', 'poll_response', 'quiz_completed', 'teacher_confirmed'],
      required: true,
    },
    note: {
      type: String,
      maxlength: 500,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT: Participation counts reflect observable events, not intelligence or learning outcomes.
ParticipationEventSchema.index({ session: 1, student: 1 });
ParticipationEventSchema.index({ class: 1, occurredAt: -1 });
ParticipationEventSchema.index({ student: 1, occurredAt: -1 });

export const ParticipationEvent = mongoose.model<IParticipationEvent>(
  'ParticipationEvent',
  ParticipationEventSchema
);
