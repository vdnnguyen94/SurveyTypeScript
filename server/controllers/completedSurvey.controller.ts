import { Request, Response } from 'express';
import CompletedSurvey from '../models/completedSurvey.model';
import errorHandler from './error.controller';
import Question, { QuestionDocument } from '../models/question.model';
import Survey, { SurveyDocument } from '../models/survey.model';

export const updateSurveyResults = async (req: Request, res: Response) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const answeredQuestions = Object.keys(req.body);
        const surveyQuestions = await Question.find({ survey: survey._id });
        const surveyQuestionIds = surveyQuestions.map((question: any) => question._id.toString());
        const allQuestionsAnswered = surveyQuestionIds.every((questionId: string) =>
            answeredQuestions.includes(questionId)
        );

        if (!allQuestionsAnswered) {
            return res.status(400).json({
                error: 'All questions must be answered.',
            });
        }

        for (const questionId in req.body) {
            const question = await Question.findById(questionId);
            if (question) {
                if (question.questionType === 'MC') {
                    const answerIndex = parseInt(req.body[questionId]);
                    if (answerIndex >= 0 && answerIndex < 5) {
                        if (!question.surveyResults) {
                            question.surveyResults = new Array<number>(5).fill(0);
                        }
                        question.surveyResults[answerIndex]++;
                    }
                } else if (question.questionType === 'TF') {
                    const userAnswer = req.body[questionId];
                    if (!question.surveyResult2) {
                        question.surveyResult2 = [];
                    }
                    question.surveyResult2.push(userAnswer);
                }
                await question.save();
            } else {
                console.error(`Question with ID ${questionId} not found.`);
            }
        }

        const newCompletedSurvey = new CompletedSurvey({
            survey: survey._id,
            user: user._id,
        });
        await newCompletedSurvey.save();

        res.json({
            message: 'Survey results updated successfully.',
        });
    } catch (err:any) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export const notCompleteSurvey = async (req: Request, res: Response, next: Function) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const completedSurvey = await Survey.findOne({
            survey: survey._id,
            user: user._id,
        });
        if (completedSurvey) {
            return res.status(400).json({
                error: 'You have already completed this survey.',
            });
        }
        next();
    } catch (err:any) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export const completedSurvey = async (req: Request, res: Response) => {
    try {
        const survey = req.survey;
        const user = req.auth;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const completedSurvey = await CompletedSurvey.findOne({
            survey: survey._id,
            user: user._id,
        });
        if (completedSurvey) {
            return res.status(200).json({
                answer: 'Yes',
            });
        } else {
            return res.status(200).json({
                answer: 'No',
            });
        }
    } catch (err:any) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export const downloadSurveyResult = async (req: Request, res: Response) => {
    try {
        const survey = req.survey;
        if (!survey) {
            return res.status(400).json({
                error: 'Survey not found.',
            });
        }
        const surveyQuestions = await Question.find({ survey: survey._id });

        const surveyData = {
            survey,
            surveyQuestions,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=survey_result.json');

        res.json(surveyData);
    } catch (err) {
        return res.status(400).json({
            error: "Issue from obtaining the file",
        });
    }
};
export default {updateSurveyResults,notCompleteSurvey, completedSurvey, downloadSurveyResult};