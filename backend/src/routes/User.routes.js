import { Router } from "express";
import { 
    signin, 
    signup, 
    verifyToken, 
    googleAuth,
    deleteProductFromCart, 
    getCartProducts,
    updateCartItemQuantity,
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    addProductToCart
} from "../controllers/User.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Auth routes
userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
userRouter.post("/google-auth", googleAuth);
userRouter.get("/verify", verifyJWT, verifyToken);

// Cart routes - IMPORTANT: Remove the duplicate route
// userRouter.post("/addProduct/:id", verifyJWT, addToCart); // REMOVE THIS LINE
userRouter.post("/addProduct/:productId", verifyJWT, addProductToCart); // Keep only this one
userRouter.delete("/cart/:id", verifyJWT, deleteProductFromCart);
userRouter.get("/cartProducts", verifyJWT, getCartProducts);
userRouter.put("/cart/:id/quantity", verifyJWT, updateCartItemQuantity);

// User profile routes
userRouter.get("/profile", verifyJWT, getUserProfile);
userRouter.put("/profile", verifyJWT, updateUserProfile);
userRouter.post("/address", verifyJWT, addUserAddress);
userRouter.put("/address/:addressId", verifyJWT, updateUserAddress);
userRouter.delete("/address/:addressId", verifyJWT, deleteUserAddress);

export { userRouter };