import express from "express";
import { deleteThisProduct, signin, signup } from "../Controller/User.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.delete("/deleteProduct/:id", deleteThisProduct);

export { userRouter };
