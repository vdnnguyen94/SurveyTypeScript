import Survey, { SurveyDocument } from '../models/survey.model';
import User, { UserDocument } from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from './error.controller';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
      interface Request {
        profile?: any
      }
    }
  }
  declare global {
    namespace Express {
      interface Request {
        survey?: SurveyDocument
      }
    }
  }
  const create = async (req: Request, res: Response) => {
    try {
      const user = req.profile;
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
  
      const survey = new Survey({
        name: req.body.name,
        owner: user._id,
        dateExpire: req.body.dateExpire,
      });
  
      await survey.save();
  
      res.status(201).json({
        message: 'Survey created successfully.',
        survey,
      });
    } catch (err: any) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  };

const updateExpired = async () => {
  try {
    const expiredSurveys = await Survey.find({
      dateExpire: { $lt: new Date() },
      status: { $ne: 'EXPIRED' },
    });

    for (const survey of expiredSurveys) {
      survey.status = 'EXPIRED';
      await survey.save();
    }
  } catch (error: any) {
    console.error('Error updating expired surveys:', error);
    throw new Error('Error updating expired surveys');
  }
};

const list = async (req: Request, res: Response) => {
  await updateExpired();
  try {
    const surveys = await Survey.find({ status: 'ACTIVE' }).populate({
      path: 'owner',
      select: 'username firstName lastName email',
    });
    res.json(surveys);
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listMySurveys = async (req: Request, res: Response) => {
  try {
    await updateExpired();
    const user = req.profile;
    if (!user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
    const ownerId = user._id;
    const surveys = await Survey.find({ owner: ownerId }).populate({
      path: 'owner',
      select: 'username firstName lastName email',
    });
    res.json(surveys);
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const surveyByID = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    const survey = await Survey.findById(id).populate('owner');
    if (!survey) {
      return res.status(400).json({
        error: 'Survey not found, check ID',
      });
    }
    req.survey = survey;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve survey',
    });
  }
};

const activate = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const inactivate = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    let survey = req.survey;
    survey = extend(survey, req.body);
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
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const isOwner = req.survey && req.auth && req.survey.owner._id == req.auth._id;
  if (!isOwner) {
    return res.status(403).json({
      error: 'User is not authorized',
    });
  }
  next();
};

const read = (req: Request, res: Response) => {
  return res.json(req.survey);
};

export default {
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
