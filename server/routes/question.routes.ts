import express from 'express';
import questionCtrl from '../controllers/question.controller'; // Update extension to .ts
import authCtrl from '../controllers/auth.controller'; // Update extension to .ts
import surveyCtrl from '../controllers/survey.controller'; // Update extension to .ts

const router = express.Router();

router.route('/api/surveys/questions/:surveyId')
  .post(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    questionCtrl.create as (req: express.Request, res: express.Response) => void
  )
  .get(questionCtrl.list as (req: express.Request, res: express.Response) => void)
  .delete(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    questionCtrl.removeAll as (req: express.Request, res: express.Response) => void
  );

router.route('/api/question/:questionId/get')
  .get(questionCtrl.read as (req: express.Request, res: express.Response) => void);

router.route('/api/question/:questionId/MC')
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    questionCtrl.updateMC as (req: express.Request, res: express.Response) => void
  );

router.route('/api/question/:surveyId/:questionId')
  .post(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    questionCtrl.update as (req: express.Request, res: express.Response) => void
  )
  .delete(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    questionCtrl.remove as (req: express.Request, res: express.Response) => void
  );

router.route('/api/question/:surveyId/:questionId/updateName')
  .post(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    questionCtrl.updateName as (req: express.Request, res: express.Response) => void
  );

router.param('surveyId', surveyCtrl.surveyByID);
router.param('questionId', questionCtrl.questionByID);

export default router;
