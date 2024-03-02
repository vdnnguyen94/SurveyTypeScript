import express from 'express';
import surveyCtrl from '../controllers/survey.controller'; // Update extension to .ts
import authCtrl from '../controllers/auth.controller'; // Update extension to .ts
import userCtrl from '../controllers/user.controller'; // Update extension to .ts
import submitCtrl from '../controllers/completedSurvey.controller'; // Update extension to .ts

const router = express.Router();

router.route('/api/surveys')
  .get(surveyCtrl.list);

router.route('/api/surveys/:surveyId')
  .get(surveyCtrl.read)
  .post(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    surveyCtrl.update as (req: express.Request, res: express.Response) => void
  )
  .delete(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    surveyCtrl.remove as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/by/:userId')
  .post(
    authCtrl.requireSignin,
    surveyCtrl.create as (req: express.Request, res: express.Response) => void
  )
  .get(
    authCtrl.requireSignin,
    surveyCtrl.listMySurveys as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/:surveyId/activate')
  .put(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    surveyCtrl.activate as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/:surveyId/inactivate')
  .put(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    surveyCtrl.inactivate as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/:surveyId/submit')
  .post(
    authCtrl.requireSignin,
    submitCtrl.notCompleteSurvey as (req: express.Request, res: express.Response, next: express.NextFunction) => void,
    submitCtrl.updateSurveyResults as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/:surveyId/check')
  .get(
    authCtrl.requireSignin,
    submitCtrl.completedSurvey as (req: express.Request, res: express.Response) => void
  );

router.route('/api/surveys/:surveyId/downloadresult')
  .get(
    authCtrl.requireSignin,
    surveyCtrl.isOwner,
    submitCtrl.downloadSurveyResult as (req: express.Request, res: express.Response) => void
  );

router.param('surveyId', surveyCtrl.surveyByID);
router.param('userId', userCtrl.userByID);

export default router;
