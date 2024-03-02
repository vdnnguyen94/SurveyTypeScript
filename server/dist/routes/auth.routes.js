"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller")); // Update extension to .ts
const router = express_1.default.Router();
router.route('/auth/signin').post(auth_controller_1.default.signin // Type assertion for signin
);
router.route('/auth/signout').get(auth_controller_1.default.signout // Type assertion for signout
);
exports.default = router;
