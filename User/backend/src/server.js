import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/index.js';
import { userRouter } from "./routes/User.routes.js";
import productRouter from './routes/product.routes.js';


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            process.env.VITE_APP_URL, 
            "35.160.120.126", 
            "44.233.151.27", 
            "34.211.200.85"
        ];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
