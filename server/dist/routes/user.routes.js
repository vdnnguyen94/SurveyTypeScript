"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller")); // Update extension to .ts
const auth_controller_1 = __importDefault(require("../controllers/auth.controller")); // Update extension to .ts
// Van Nguyen added updatePassword and resetPassword
const router = express_1.default.Router();
router.route('/api/users')
    .get(user_controller_1.default.list)
    .post(user_controller_1.default.create);
router.route('/api/users/:userId')
    .get(auth_controller_1.default.requireSignin, user_controller_1.default.read)
    .put(auth_controller_1.default.requireSignin, auth_controller_1.default.hasAuthorization, user_controller_1.default.update)
    .delete(auth_controller_1.default.requireSignin, auth_controller_1.default.hasAuthorization, user_controller_1.default.remove);
// Add the new routes for updatePassword and resetPassword
router.route('/api/users/:userId/updatepassword')
    .post(auth_controller_1.default.requireSignin, auth_controller_1.default.hasAuthorization, user_controller_1.default.updatePassword // Type assertion for updatePassword
);
router.route('/api/users/resetpassword')
    .post(user_controller_1.default.resetPassword); // Type assertion for resetPassword
// Include email and username parameters in the route paths
router.route('/api/users/email/:email')
    .get(user_controller_1.default.checkEmail);
router.route('/api/users/username/:username')
    .get(user_controller_1.default.checkUsername);
router.param('userId', user_controller_1.default.userByID);
exports.default = router;
