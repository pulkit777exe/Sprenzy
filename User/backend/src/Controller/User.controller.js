import dotenv from "dotenv";
dotenv.config();
import { UserModel } from "../models/User.models.js";
import { ProductModel } from "../models/Product.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const MESSAGES = {
    MISSING_FIELDS: "Provide username, password, and email",
    USER_EXISTS: "User already exists with that email",
    USER_CREATION_ERROR: "Error while creating user",
    USER_CREATED: "User created successfully",
    SIGNIN_SUCCESS: "Sign-in successful",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    SIGNIN_ERROR: "An error occurred during sign-in",
    SIGNUP_ERROR: "An error occurred during signup",
    PRODUCT_NOT_FOUND: "Product not found",
    PRODUCT_NOT_IN_CART: "Product not in cart",
    DELETE_SUCCESS: "Product deleted from cart successfully"
  };

export const signup = async (req,res) => {
    const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ message: MESSAGES.MISSING_FIELDS });
      }
    
      try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: MESSAGES.USER_EXISTS });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const user = await UserModel.create({ username, password: hashedPassword, email });
        if (!user) {
          return res.status(500).json({ error: MESSAGES.USER_CREATION_ERROR });
        }
    
        res.status(201).json({ message: MESSAGES.USER_CREATED });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: MESSAGES.SIGNUP_ERROR });
      }
}

export const signin = async (req,res) => {
    const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: MESSAGES.MISSING_FIELDS });
      }
    
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: MESSAGES.INVALID_CREDENTIALS });
        }
    
        const tokenData = {
          userId: user._id,
          userData: user
        };
    
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ message: MESSAGES.SIGNIN_SUCCESS, token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: MESSAGES.SIGNIN_ERROR });
      }
}

export const products = async (req,res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching products" });
      }
}

export const userProducts = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).populate('userCart');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.userCart);
      } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Server error' });
      }
}

export const deleteProducts = async (req,res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
          return res.status(404).json({ error: MESSAGES.PRODUCT_NOT_FOUND });
        }
    
        const user = await UserModel.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
        }
    
        if (!user.userCart.includes(req.params.id)) {
          return res.status(400).json({ error: MESSAGES.PRODUCT_NOT_IN_CART });
        }
    
        user.userCart.pull(req.params.id);
        await user.save();
    
        res.json({ message: MESSAGES.DELETE_SUCCESS });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting product from cart" });
      }
}