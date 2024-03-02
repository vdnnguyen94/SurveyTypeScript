import mongoose, { Document, Schema } from 'mongoose';

export interface SurveyDocument extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  dateExpire?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

const surveySchema: Schema<SurveyDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateExpire: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  },
});

const Survey = mongoose.model<SurveyDocument>('Survey', surveySchema);

export default Survey;
