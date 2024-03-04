// server/index.ts
import express from 'express';
import connectDB from './server/config/db';
import config  from './server/config/config';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import surveyRoutes from './server/routes/survey.routes'; // Update extension to .ts
import questionRoutes from './server/routes/question.routes'; // Update extension to .ts
import userRoutes from './server/routes/user.routes'; // Update extension to .ts
import authRoutes from './server/routes/auth.routes'; // Update extension to .ts
import path from 'path';
const app = express();
console.log("PORT process.env: ", process.env.PORT);
const port = process.env.PORT || 8000;

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

// Serve static files from the 'main/client/build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle other routes or API endpoints
app.get('/api/users', (req, res) => {
  // Your route handling logic here
});

// Handle the root URL
app.get('/', (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

