import express from 'express';
import { connectDB } from './db/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from "./routes/User.routes.js";
import productRouter from './routes/product.routes.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", process.env.VITE_APP_URL], 
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
