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
import { UserModel } from './models/User.models.js';
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

app.get("/user/products",async (req, res) => {
  try{
    const products = await UserModel.findById(req.user._id).populate("userCart");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products"});
  }
})

app.post("/cart", async (req, res) => {
  const { title, price, imageUrl } = req.body;
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await ProductModel.findOne({title});
    await product.save();
    user.userCart.push(product._id);
    await user.save();
    res.json({ message: "Product added to cart", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding to cart" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});