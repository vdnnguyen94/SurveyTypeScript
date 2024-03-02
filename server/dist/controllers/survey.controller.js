"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const survey_model_1 = __importDefault(require("../models/survey.model"));
const extend_1 = __importDefault(require("lodash/extend"));
const error_controller_1 = __importDefault(require("./error.controller"));
const create = async (req, res) => {
    try {
        const user = req.profile;
        if (!user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }
        const survey = new survey_model_1.default({
            name: req.body.name,
            owner: user._id,
            dateExpire: req.body.dateExpire,
        });
        await survey.save();
        res.status(201).json({
            message: 'Survey created successfully.',
            survey,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const updateExpired = async () => {
    try {
        const expiredSurveys = await survey_model_1.default.find({
            dateExpire: { $lt: new Date() },
            status: { $ne: 'EXPIRED' },
        });
        for (const survey of expiredSurveys) {
            survey.status = 'EXPIRED';
            await survey.save();
        }
    }
    catch (error) {
        console.error('Error updating expired surveys:', error);
        throw new Error('Error updating expired surveys');
    }
};
const list = async (req, res) => {
    await updateExpired();
    try {
        const surveys = await survey_model_1.default.find({ status: 'ACTIVE' }).populate({
            path: 'owner',
            select: 'username firstName lastName email',
        });
        res.json(surveys);
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const listMySurveys = async (req, res) => {
    try {
        await updateExpired();
        const user = req.profile;
        if (!user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }
        const ownerId = user._id;
        const surveys = await survey_model_1.default.find({ owner: ownerId }).populate({
            path: 'owner',
            select: 'username firstName lastName email',
        });
        res.json(surveys);
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const surveyByID = async (req, res, next, id) => {
    try {
        const survey = await survey_model_1.default.findById(id).populate('owner');
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found, check ID',
            });
        }
        req.survey = survey;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve survey',
        });
    }
};
const activate = async (req, res) => {
    try {
        const survey = req.survey;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found, check ID',
            });
        }
        survey.status = 'ACTIVE';
        await survey.save();
        return res.status(200).json({
            message: 'Survey Activated Successfully.',
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const inactivate = async (req, res) => {
    try {
        const survey = req.survey;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found, check ID',
            });
        }
        survey.status = 'INACTIVE';
        await survey.save();
        return res.status(200).json({
            message: 'Survey Inactivated Successfully.',
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const update = async (req, res) => {
    try {
        let survey = req.survey;
        survey = (0, extend_1.default)(survey, req.body);
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found, check ID',
            });
        }
        if (req.body.dateExpire) {
            survey.status = 'ACTIVE';
        }
        await survey.save();
        res.json({
            message: 'Survey Updated Successfully',
            survey,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const remove = async (req, res) => {
    try {
        const survey = req.survey;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found, check ID',
            });
        }
        const deletedSurvey = await survey.deleteOne();
        res.json({
            message: 'Your Survey has been successfully removed',
            survey: deletedSurvey,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const isOwner = (req, res, next) => {
    const isOwner = req.survey && req.auth && req.survey.owner._id == req.auth._id;
    if (!isOwner) {
        return res.status(403).json({
            error: 'User is not authorized',
        });
    }
    next();
};
const read = (req, res) => {
    return res.json(req.survey);
};
exports.default = {
    create,
    updateExpired,
    list,
    listMySurveys,
    surveyByID,
    read,
    activate,
    inactivate,
    update,
    remove,
    isOwner,
};
