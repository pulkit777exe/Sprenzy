import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODBCONNECTIONURI =  process.env.MONGODB_CONNECTION_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGODBCONNECTIONURI}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export { connectDB };