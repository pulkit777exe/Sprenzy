import { Router } from "express";
import { 
    signin, 
    signup, 
    verifyToken, 
    googleAuth,
    addToCart, 
    deleteProductFromCart, 
    getCartItems,
    updateCartItemQuantity,
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress
} from "../Controller/User.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Auth routes
userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
userRouter.post("/google-auth", googleAuth);
userRouter.get("/verify", verifyJWT, verifyToken);

// Cart routes
userRouter.post("/addProduct/:id", verifyJWT, addToCart);
userRouter.delete("/cart/:id", verifyJWT, deleteProductFromCart);
userRouter.get("/cartProducts", verifyJWT, getCartItems);
userRouter.put("/cart/:id/quantity", verifyJWT, updateCartItemQuantity);

// Profile routes
userRouter.get("/profile", verifyJWT, getUserProfile);
userRouter.put("/profile", verifyJWT, updateUserProfile);
userRouter.post("/address", verifyJWT, addUserAddress);
userRouter.put("/address/:addressId", verifyJWT, updateUserAddress);
userRouter.delete("/address/:addressId", verifyJWT, deleteUserAddress);

export { userRouter };