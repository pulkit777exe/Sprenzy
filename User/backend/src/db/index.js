import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongodbconnection =  process.env.MONGODB_CONNECTION_URL;
const mongodbname = process.env.DB_NAME

const connectDB = async () => {
    try {
        await mongoose.connect(`${mongodbconnection}/${mongodbname}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export { connectDB };