import express from 'express';
import { connectDB } from './db/index.js';
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", process.env.VITE_APP_URL], 
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));

connectDB();

import { userRouter } from './routes/User.routes.js';
import { adminRouter } from './routes/Admin.routes.js';
import { ProductModel } from './models/Product.models.js';
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);

app.get("/products", async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  }); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});