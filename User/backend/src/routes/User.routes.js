import express from "express";
import { 
    signin, 
    signup, 
    cartProducts, 
    deleteThisProduct, 
    addToCart, 
    getCartItems,
    verifyToken
} from "../Controller/User.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

// Protected cart routes
userRouter.post("/addProduct/:productId", verifyJWT, addToCart);
userRouter.get("/cart", verifyJWT, deleteThisProduct);
userRouter.delete("/cart/:productId", verifyJWT, deleteThisProduct);
userRouter.get("/cartProducts", verifyJWT, getCartItems);
userRouter.get("/verify", verifyJWT, verifyToken);

export { userRouter };