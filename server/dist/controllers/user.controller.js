"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const extend_1 = __importDefault(require("lodash/extend"));
const error_controller_1 = __importDefault(require("./error.controller"));
const create = async (req, res) => {
    console.log(req.body);
    const user = new user_model_1.default(req.body);
    try {
        await user.save();
        return res.status(200).json({
            message: 'Successfully signed up!',
        });
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            // Duplicate username error
            return res.status(400).json({
                error: 'Username is already taken.',
            });
        }
        else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Duplicate email error
            return res.status(400).json({
                error: 'Email is already taken.',
            });
        }
        else {
            // Other validation errors
            return res.status(400).json({
                error: error_controller_1.default.getErrorMessage(err),
            });
        }
    }
};
const list = async (req, res) => {
    try {
        let users = await user_model_1.default.find().select('username firstName lastName email companyName updated created');
        res.json(users);
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const userByID = async (req, res, next, id) => {
    try {
        let user = await user_model_1.default.findById(id);
        if (!user)
            return res.status(400).json({
                error: 'User not found',
            });
        req.profile = user;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve user',
        });
    }
};
const read = (req, res) => {
    const user = req.profile;
    // Check if user exists to avoid null or undefined errors
    if (user) {
        return res.json(user);
    }
    else {
        return res.status(404).json({ error: 'User not found' });
    }
};
const update = async (req, res) => {
    try {
        let user = req.profile;
        user = (0, extend_1.default)(user, req.body);
        await user.save();
        ;
        res.json({
            message: 'Your Account is Updated Successfully',
            user,
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
        let user = req.profile;
        let deletedUser = await user.deleteOne();
        res.json({
            message: 'Your Account has been successfully removed',
            user: deletedUser,
        });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, newPasswordConfirm } = req.body;
        const user = req.profile;
        if (!user.authenticate(oldPassword)) {
            return res.status(401).json({
                error: "Incorrect old password",
            });
        }
        if (newPassword !== newPasswordConfirm) {
            return res.status(400).json({ error: "New password and confirmation do not match." });
        }
        user.password = newPassword;
        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ message: "Password updated successfully.", user });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, newPassword, newPasswordConfirm } = req.body;
        // Check if username and email match
        const user = await user_model_1.default.findOne({ username, email });
        if (!user) {
            return res.status(401).json({ error: "Username and email do not match." });
        }
        // Check if newPassword and newPasswordConfirm are equal
        if (newPassword !== newPasswordConfirm) {
            return res.status(400).json({ error: "New password and confirmation do not match." });
        }
        // Set the new password and update the user
        user.password = newPassword;
        await user.save();
        // Clear sensitive information before sending the response
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ message: "Password reset successfully.", user });
    }
    catch (err) {
        return res.status(400).json({
            error: error_controller_1.default.getErrorMessage(err),
        });
    }
};
const checkEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.json({ error: 'Email is already taken.' });
        }
        return res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const checkUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const existingUser = await user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.json({ error: 'Username is already taken.' });
        }
        return res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const pass = async (req, res, next, id) => {
    try {
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve user',
        });
    }
};
exports.default = {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    updatePassword,
    resetPassword,
    checkEmail,
    checkUsername,
    pass
};
