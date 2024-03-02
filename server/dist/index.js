"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/index.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const survey_routes_1 = __importDefault(require("./routes/survey.routes")); // Update extension to .ts
const question_routes_1 = __importDefault(require("./routes/question.routes")); // Update extension to .ts
const user_routes_1 = __importDefault(require("./routes/user.routes")); // Update extension to .ts
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Update extension to .ts
const app = (0, express_1.default)();
console.log("PORT process.env: ", process.env.PORT);
const port = process.env.PORT || 8000;
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use('/', user_routes_1.default);
app.use('/', auth_routes_1.default);
app.use('/', survey_routes_1.default);
app.use('/', question_routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
