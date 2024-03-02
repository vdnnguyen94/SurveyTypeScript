import mongoose, { Document, Schema } from 'mongoose';

export interface CompletedSurveyDocument extends Document {
  survey: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const completedSurveySchema: Schema<CompletedSurveyDocument> = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const CompletedSurvey = mongoose.model<CompletedSurveyDocument>('CompletedSurvey', completedSurveySchema);

export default CompletedSurvey;
