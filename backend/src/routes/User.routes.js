import { Router } from "express";
import { 
    signin, 
    signup, 
    verifyToken, 
    googleAuth,
    addToCart, 
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

userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
userRouter.post("/google-auth", googleAuth);
userRouter.get("/verify", verifyJWT, verifyToken);

userRouter.post("/addProduct/:id", verifyJWT, addToCart);
userRouter.delete("/cart/:id", verifyJWT, deleteProductFromCart);
userRouter.get("/cartProducts", verifyJWT, getCartProducts);
userRouter.put("/cart/:id/quantity", verifyJWT, updateCartItemQuantity);

userRouter.get("/profile", verifyJWT, getUserProfile);
userRouter.put("/profile", verifyJWT, updateUserProfile);
userRouter.post("/address", verifyJWT, addUserAddress);
userRouter.put("/address/:addressId", verifyJWT, updateUserAddress);
userRouter.delete("/address/:addressId", verifyJWT, deleteUserAddress);

userRouter.post("/addProduct/:productId", verifyJWT, addProductToCart);

export { userRouter };