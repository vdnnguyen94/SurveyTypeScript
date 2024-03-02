import mongoose, { Document, Schema } from 'mongoose';

export interface QuestionDocument extends Document {
  survey: mongoose.Types.ObjectId;
  questionOrder: number;
  questionType: 'MC' | 'TF';
  name?: string;
  answerNum?: number;
  possibleAnswers?: string[];
  surveyResults?: number[];
  surveyResult2?: string[];
}

const questionSchema: Schema<QuestionDocument> = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  questionOrder: {
    type: Number,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['MC', 'TF'],
    required: true,
  },
  name: {
    type: String,
  },
  answerNum: {
    type: Number,
    validate: {
      validator: function(this: QuestionDocument, v: number) {
        return this.questionType === 'MC' ? (v >= 1 && v <= 5) : v === undefined;
      },
      message: 'answerNum should be between 1 and 5 for MC type questions.',
    },
  },
  possibleAnswers: {
    type: [String],
    validate: {
      validator: function(this: QuestionDocument, v: string[]) {
        return this.questionType === 'MC' ? (v.length === this.answerNum) : true;
      },
      message: 'Possible answers should have the same length as answerNum for MC type questions.',
    },
  },
  surveyResults: {
    type: [Number],
    default: [0, 0, 0, 0, 0],
    validate: {
      validator: function(this: QuestionDocument, v: number[]) {
        return this.questionType === 'MC' ? (v.length === 5) : true;
      },
      message: 'Survey results array should have maximum length 5 for MC type questions.',
    },
  },
  surveyResult2: {
    type: [String],
    validate: {
      validator: function(this: QuestionDocument, v: string[]) {
        return this.questionType === 'TF' ? (v.length >= 0) : true;
      },
      message: 'Survey result array should have at least one element for TF type questions.',
    },
  },
});

const Question = mongoose.model<QuestionDocument>('Question', questionSchema);

export default Question;
