import express from "express";
import { deleteProducts, products, signin, signup, userProducts } from "../Controller/User.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/products", products);
userRouter.get("/user/products", userProducts);
userRouter.delete("/deleteProduct/:id", deleteProducts);

export { userRouter };
