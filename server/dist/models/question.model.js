"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const questionSchema = new mongoose_1.Schema({
    survey: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: function (v) {
                return this.questionType === 'MC' ? (v >= 1 && v <= 5) : v === undefined;
            },
            message: 'answerNum should be between 1 and 5 for MC type questions.',
        },
    },
    possibleAnswers: {
        type: [String],
        validate: {
            validator: function (v) {
                return this.questionType === 'MC' ? (v.length === this.answerNum) : true;
            },
            message: 'Possible answers should have the same length as answerNum for MC type questions.',
        },
    },
    surveyResults: {
        type: [Number],
        default: [0, 0, 0, 0, 0],
        validate: {
            validator: function (v) {
                return this.questionType === 'MC' ? (v.length === 5) : true;
            },
            message: 'Survey results array should have maximum length 5 for MC type questions.',
        },
    },
    surveyResult2: {
        type: [String],
        validate: {
            validator: function (v) {
                return this.questionType === 'TF' ? (v.length >= 0) : true;
            },
            message: 'Survey result array should have at least one element for TF type questions.',
        },
    },
});
const Question = mongoose_1.default.model('Question', questionSchema);
exports.default = Question;
