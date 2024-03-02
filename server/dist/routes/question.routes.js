"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = __importDefault(require("../controllers/question.controller")); // Update extension to .ts
const auth_controller_1 = __importDefault(require("../controllers/auth.controller")); // Update extension to .ts
const survey_controller_1 = __importDefault(require("../controllers/survey.controller")); // Update extension to .ts
const router = express_1.default.Router();
router.route('/api/surveys/questions/:surveyId')
    .post(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, question_controller_1.default.create)
    .get(question_controller_1.default.list)
    .delete(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, question_controller_1.default.removeAll);
router.route('/api/question/:questionId/get')
    .get(question_controller_1.default.read);
router.route('/api/question/:questionId/MC')
    .post(auth_controller_1.default.requireSignin, auth_controller_1.default.hasAuthorization, question_controller_1.default.updateMC);
router.route('/api/question/:surveyId/:questionId')
    .post(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, question_controller_1.default.update)
    .delete(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, question_controller_1.default.remove);
router.route('/api/question/:surveyId/:questionId/updateName')
    .post(auth_controller_1.default.requireSignin, survey_controller_1.default.isOwner, question_controller_1.default.updateName);
router.param('surveyId', survey_controller_1.default.surveyByID);
router.param('questionId', question_controller_1.default.questionByID);
exports.default = router;
