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
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    next();
})
// app.use(cors({
//     origin: [
//         process.env.VITE_APP_URL, 
//         "http://localhost:5173", 
//         "http://localhost:5174", 
//         "35.160.120.126", 
//         "44.233.151.27", 
//         "34.211.200.85"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"]
// }));

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
