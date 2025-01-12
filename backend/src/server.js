import express from 'express';
import { connectDB } from './db/index.js';
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectDB();

import { userRouter } from './routes/User.routes.js';
import { adminRouter } from './routes/Admin.routes.js';
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});