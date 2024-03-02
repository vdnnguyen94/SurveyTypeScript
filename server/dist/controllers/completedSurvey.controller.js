"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSurveyResult = exports.completedSurvey = exports.notCompleteSurvey = exports.updateSurveyResults = void 0;
const completedSurvey_model_1 = __importDefault(require("../models/completedSurvey.model"));
const error_controller_1 = __importDefault(require("./error.controller"));
const question_model_1 = __importDefault(require("../models/question.model"));
const survey_model_1 = __importDefault(require("../models/survey.model"));
const updateSurveyResults = async (req, res) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const answeredQuestions = Object.keys(req.body);
        const surveyQuestions = await question_model_1.default.find({ survey: survey._id });
        const surveyQuestionIds = surveyQuestions.map((question) => question._id.toString());
        const allQuestionsAnswered = surveyQuestionIds.every((questionId) => answeredQuestions.includes(questionId));
        if (!allQuestionsAnswered) {
            return res.status(400).json({
                error: 'All questions must be answered.',
            });
        }
        for (const questionId in req.body) {
            const question = await question_model_1.default.findById(questionId);
            if (question) {
                if (question.questionType === 'MC') {
                    const answerIndex = parseInt(req.body[questionId]);
                    if (answerIndex >= 0 && answerIndex < 5) {
                        if (!question.surveyResults) {
                            question.surveyResults = new Array(5).fill(0);
                        }
                        question.surveyResults[answerIndex]++;
                    }
                }
                else if (question.questionType === 'TF') {
                    const userAnswer = req.body[questionId];
                    if (!question.surveyResult2) {
                        question.surveyResult2 = [];
                    }
                    question.surveyResult2.push(userAnswer);
                }
                await question.save();
            }
            else {
                console.error(`Question with ID ${questionId} not found.`);
            }
        }
        const newCompletedSurvey = new completedSurvey_model_1.default({
            survey: survey._id,
            user: user._id,
        });
        await newCompletedSurvey.save();
        res.json({
            message: 'Survey results updated successfully.',
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
exports.updateSurveyResults = updateSurveyResults;
const notCompleteSurvey = async (req, res, next) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const completedSurvey = await survey_model_1.default.findOne({
            survey: survey._id,
            user: user._id,
        });
        if (completedSurvey) {
            return res.status(400).json({
                error: 'You have already completed this survey.',
            });
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
exports.notCompleteSurvey = notCompleteSurvey;
const completedSurvey = async (req, res) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const completedSurvey = await completedSurvey_model_1.default.findOne({
            survey: survey._id,
            user: user._id,
        });
        if (completedSurvey) {
            return res.status(200).json({
                answer: 'Yes',
            });
        }
        else {
            return res.status(200).json({
                answer: 'No',
            });
        }
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
exports.completedSurvey = completedSurvey;
const downloadSurveyResult = async (req, res) => {
    try {
        const survey = req.survey;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const surveyQuestions = await question_model_1.default.find({ survey: survey._id });
        const surveyData = {
            survey,
            surveyQuestions,
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=survey_result.json');
        res.json(surveyData);
    }
    catch (err) {
        return res.status(400).json({
            error: "Issue from obtaining the file",
        });
    }
};
exports.downloadSurveyResult = downloadSurveyResult;
exports.default = { updateSurveyResults: exports.updateSurveyResults, notCompleteSurvey: exports.notCompleteSurvey, completedSurvey: exports.completedSurvey, downloadSurveyResult: exports.downloadSurveyResult };
