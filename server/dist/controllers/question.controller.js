"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.updateMC = exports.updateName = void 0;
const question_model_1 = __importDefault(require("../models/question.model"));
const error_controller_1 = __importDefault(require("./error.controller"));
const create = async (req, res) => {
    try {
        const survey = req.survey;
        // Validate if a question with the same name already exists in the survey
        const existingQuestionWithName = await question_model_1.default.findOne({
            survey: survey?._id,
            name: req.body.name,
        });
        if (existingQuestionWithName) {
            return res.status(400).json({
                error: 'Question with the same name already exists in the survey.',
            });
        }
        // Check if answerNum and possibleAnswers have the same length for MC type questions
        if (req.body.questionType === 'MC' &&
            req.body.answerNum !== req.body.possibleAnswers.length) {
            return res.status(400).json({
                error: 'answerNum should have the same length as possibleAnswers for MC type questions.',
            });
        }
        // Check if the question is MC, and validate answerNum
        if (req.body.questionType === 'MC') {
            const answerNum = parseInt(req.body.answerNum);
            if (isNaN(answerNum) || answerNum < 1 || answerNum > 5) {
                return res.status(400).json({
                    error: 'answerNum should be an integer between 1 and 5 for MC type questions.',
                });
            }
            // Check if all possibleAnswers are unique
            const uniqueAnswers = new Set(req.body.possibleAnswers);
            if (uniqueAnswers.size !== req.body.possibleAnswers.length) {
                return res.status(400).json({
                    error: 'Each possibleAnswer must be unique. Duplicates are not allowed.',
                });
            }
        }
        // Check the number of existing questions in the survey
        const existingQuestionsCount = await question_model_1.default.countDocuments({
            survey: survey?._id,
        });
        // Set the questionOrder based on the number of existing questions
        const questionOrder = existingQuestionsCount + 1;
        const question = new question_model_1.default({
            survey: survey?._id,
            questionOrder: questionOrder,
            questionType: req.body.questionType,
            name: req.body.name,
            answerNum: req.body.answerNum,
            possibleAnswers: req.body.possibleAnswers,
        });
        // Save the question to the database
        await question.save();
        res.status(201).json({
            message: 'Question created successfully.',
            question,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const list = async (req, res) => {
    try {
        const survey = req.survey;
        const questions = await question_model_1.default.find({ survey: survey._id }).sort({
            questionOrder: 1,
        });
        res.json(questions);
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const update = async (req, res) => {
    try {
        const question = req.question;
        if (question.questionType === 'TF') {
            question.name = req.body.name;
        }
        else if (question.questionType === 'MC') {
            const survey = req.survey;
            const existingQuestionWithName = await question_model_1.default.findOne({
                survey: survey._id,
                name: req.body.name,
            });
            if (existingQuestionWithName) {
                return res.status(400).json({
                    error: 'Question with the same name already exists in the survey.',
                });
            }
            if (req.body.questionType === 'MC' &&
                req.body.answerNum !== req.body.possibleAnswers.length) {
                return res.status(400).json({
                    error: 'answerNum should have the same length as possibleAnswers for MC type questions.',
                });
            }
            if (req.body.questionType === 'MC') {
                const answerNum = parseInt(req.body.answerNum);
                if (isNaN(answerNum) || answerNum < 2 || answerNum > 5) {
                    return res.status(400).json({
                        error: 'answerNum should be an integer between 2 and 5 for MC type questions.',
                    });
                }
            }
            const uniqueAnswers = new Set(req.body.possibleAnswers);
            if (uniqueAnswers.size !== req.body.possibleAnswers.length) {
                return res.status(400).json({
                    error: 'Each possibleAnswer must be unique. Duplicates are not allowed.',
                });
            }
            question.name = req.body.name;
            question.answerNum = req.body.answerNum;
            question.possibleAnswers = req.body.possibleAnswers;
        }
        else {
            return res.status(400).json({
                error: 'Unsupported question type.',
            });
        }
        await question.save();
        res.json({
            message: 'Question updated successfully.',
            question,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const removeAll = async (req, res) => {
    try {
        const surveyId = req.params.surveyId;
        await question_model_1.default.deleteMany({ survey: surveyId });
        res.json({
            message: 'All questions have been successfully removed for the survey.',
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const questionByID = async (req, res, next, id) => {
    try {
        let question = await question_model_1.default.findById(id);
        if (!question)
            return res.status(400).json({
                error: 'Question not found, check ID',
            });
        req.question = question;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Question not retrieve user',
        });
    }
};
const remove = async (req, res) => {
    try {
        let question = req.question;
        let deletedQuestion = await question.deleteOne();
        const survey = req.survey;
        await question_model_1.default.updateMany({ survey: survey._id, questionOrder: { $gt: question.questionOrder } }, { $inc: { questionOrder: -1 } });
        res.json({
            message: 'Question has been successfully removed',
            question: deletedQuestion,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const updateName = async (req, res) => {
    try {
        const question = req.question;
        question.name = req.body.name;
        await question.save();
        res.json({
            message: 'Question name updated successfully.',
            question,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
exports.updateName = updateName;
const updateMC = async (req, res) => {
    try {
        const question = req.question;
        if (question.questionType !== 'MC') {
            return res.status(400).json({
                error: 'Question is not of type MC.',
            });
        }
        const { newPossibleAnswers } = req.body;
        question.possibleAnswers = newPossibleAnswers;
        await question.save();
        res.json({
            message: 'MC question updated successfully.',
            question,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
exports.updateMC = updateMC;
const read = (req, res) => {
    if (!req.question) {
        return res.status(404).json({
            error: 'Question not found',
        });
    }
    return res.json(req.question);
};
exports.read = read;
exports.default = { create, list, read: exports.read, questionByID, remove, update, updateName: exports.updateName, updateMC: exports.updateMC, removeAll };
