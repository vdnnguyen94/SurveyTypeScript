// server/index.ts
import express from 'express';
import connectDB from './config/db';
import config  from './config/config';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import surveyRoutes from './routes/survey.routes'; // Update extension to .ts
import questionRoutes from './routes/question.routes'; // Update extension to .ts
import userRoutes from './routes/user.routes'; // Update extension to .ts
import authRoutes from './routes/auth.routes'; // Update extension to .ts

const app = express();
console.log("PORT process.env: ", process.env.PORT);
//const port = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', surveyRoutes);
app.use('/', questionRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
