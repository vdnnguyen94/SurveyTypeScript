// server/config/db.ts
import mongoose from 'mongoose';
import config from './config'; // Import the configuration object
import { ConnectOptions } from 'mongoose'; // Import ConnectOptions type

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      dbName: 'SurveyApp' // Use dbName instead of bName
    } as ConnectOptions)
    console.log('MongoDB connected successfully, PORT', config.port);
    console.log(config.mongoUri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
