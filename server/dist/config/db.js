"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config")); // Import the configuration object
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.mongoUri, {
            dbName: 'SurveyApp' // Use dbName instead of bName
        });
        console.log('MongoDB connected successfully');
        console.log(config_1.default.mongoUri);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};
exports.default = connectDB;
