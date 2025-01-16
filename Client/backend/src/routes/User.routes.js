import express from "express";
import { UserModel } from "../models/User.models.js";
import { ProductModel } from "../models/Product.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const userRouter = express.Router();

userRouter.use(express.json());

const MESSAGES = {
    MISSING_FIELDS: "Provide username, password, and email",
    USER_EXISTS: "User already exists with that email",
    USER_CREATION_ERROR: "Error while creating user",
    USER_CREATED: "User created successfully",
    SIGNIN_SUCCESS: "Sign-in successful",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    SIGNIN_ERROR: "An error occurred during sign-in",
    SIGNUP_ERROR: "An error occurred during signup"
};
userRouter.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: MESSAGES.MISSING_FIELDS });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            console.log("User already exists with that email");
            return res.status(400).json({ message: MESSAGES.USER_EXISTS });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({ username, password: hashedPassword, email });

        if (!user) {
            return res.status(500).json({ error: MESSAGES.USER_CREATION_ERROR });
        }

        res.status(201).json({ message: MESSAGES.USER_CREATED, Admin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: MESSAGES.SIGNUP_ERROR });
    }
});

userRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: MESSAGES.MISSING_FIELDS });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ error: MESSAGES.INVALID_CREDENTIALS });
        }

        const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({ message: MESSAGES.SIGNIN_SUCCESS, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: MESSAGES.SIGNIN_ERROR });
    }
});

userRouter.get("/products",async (req, res)=>{
    try{
        const products = await ProductModel.find();
        res.json(products);        
    } catch (errir){
        console.error(error);
        res.status(500).json({error: "An error occurred while fetching products"});
    }
});

export { userRouter };
