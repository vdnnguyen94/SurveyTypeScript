"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const survey_controller_1 = __importDefault(require("../controllers/survey.controller")); // Update extension to .ts
const auth_controller_1 = __importDefault(require("../controllers/auth.controller")); // Update extension to .ts
const user_controller_1 = __importDefault(require("../controllers/user.controller")); // Update extension to .ts
const completedSurvey_controller_1 = __importDefault(require("../controllers/completedSurvey.controller")); // Update extension to .ts
const router = express_1.default.Router();
router.route('/api/surveys')
    .get(survey_controller_1.default.list);
router.route('/api/surveys/:surveyId')
    .get(survey_controller_1.default.read)
    .post(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, survey_controller_1.default.update)
    .delete(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, survey_controller_1.default.remove);
router.route('/api/surveys/by/:userId')
    .post(auth_controller_1.default.requireSignin, survey_controller_1.default.create)
    .get(auth_controller_1.default.requireSignin, survey_controller_1.default.listMySurveys);
router.route('/api/surveys/:surveyId/activate')
    .put(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, survey_controller_1.default.activate);
router.route('/api/surveys/:surveyId/inactivate')
    .put(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, survey_controller_1.default.inactivate);
router.route('/api/surveys/:surveyId/submit')
    .post(auth_controller_1.default.requireSignin, completedSurvey_controller_1.default.notCompleteSurvey, completedSurvey_controller_1.default.updateSurveyResults);
router.route('/api/surveys/:surveyId/check')
    .get(auth_controller_1.default.requireSignin, completedSurvey_controller_1.default.completedSurvey);
router.route('/api/surveys/:surveyId/downloadresult')
    .get(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, completedSurvey_controller_1.default.downloadSurveyResult);
router.param('surveyId', survey_controller_1.default.surveyByID);
router.param('userId', user_controller_1.default.userByID);
exports.default = router;
