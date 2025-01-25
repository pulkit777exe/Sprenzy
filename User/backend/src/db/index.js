import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODBCONNECTIONURI =  process.env.MONGODB_CONNECTION_URL;
const MONGODBNAME = process.env.DB_NAME

const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGODBCONNECTIONURI}/${MONGODBNAME}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export { connectDB };