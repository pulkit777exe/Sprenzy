import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://pulkit-mongo:MongoDB%40Login@pulkit-mongo.bjucf.mongodb.net/royal-choice");
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export { connectDB };