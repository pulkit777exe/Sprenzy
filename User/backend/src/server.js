import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/index.js';
import { userRouter } from "./routes/User.routes.js";
import productRouter from './routes/Product.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.VITE_APP_URL;

app.use(express.json());
app.use(cors({
    origin: process.env.VITE_APP_URL,
    optionsSuccessStatus: 200
}));

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
