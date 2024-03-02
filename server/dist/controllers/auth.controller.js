"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import expressjwt from 'express-jwt';
const config_1 = __importDefault(require("../config/config"));
const signin = async (req, res) => {
    try {
        let user = await user_model_1.default.findOne({ "username": req.body.username });
        if (!user)
            return res.status(401).json({ error: "User not found" });
        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({ error: "Username and password don't match." });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.default.jwtSecret, { expiresIn: '24h' });
        res.cookie('SurveyApp', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return res.json({
            token,
            user: {
                _id: user._id,
                name: userName,
                email: user.email,
                username: user.username
            }
        });
    }
    catch (err) {
        return res.status(401).json({ error: "Could not sign in" });
    }
};
const signout = (req, res) => {
    res.clearCookie("SurveyApp");
    return res.status(200).json({
        message: "signed out"
    });
};
const express_jwt_1 = require("express-jwt");
const requireSignin = (0, express_jwt_1.expressjwt)({
    secret: config_1.default.jwtSecret,
    algorithms: ["HS256"],
    requestProperty: 'auth'
});
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};
exports.default = { signin, signout, requireSignin, hasAuthorization };
