import { UserModel } from "../models/User.models.js";
import { ProductModel } from "../models/Product.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.VITE_JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const SALT_ROUNDS = 10;

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
  DELETE_SUCCESS: "Product deleted from cart successfully",
  CART_ERROR: "Error while fetching cart products",
  INVALID_EMAIL: "Please provide a valid email address",
  DELETE_ERROR: "An error occurred while deleting product from cart",
  CART_RETRIEVED: "Cart products retrieved successfully",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long",
  USERNAME_TOO_SHORT: "Username must be at least 3 characters long",
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserInput = (username, password, email) => {
  const errors = [];
  
  if (username && username.length < 3) {
    errors.push(MESSAGES.USERNAME_TOO_SHORT);
  }
  
  if (password && password.length < 6) {
    errors.push(MESSAGES.PASSWORD_TOO_SHORT);
  }
  
  if (email && !isValidEmail(email)) {
    errors.push(MESSAGES.INVALID_EMAIL);
  }
  
  return errors;
};

const createSuccessResponse = (message, data = null) => {
  const response = { success: true, message };
  if (data) response.data = data;
  return response;
};

const createErrorResponse = (message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return response;
};

export const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json(createErrorResponse(MESSAGES.MISSING_FIELDS));
    }

    const validationErrors = validateUserInput(username, password, email);
    if (validationErrors.length > 0) {
      return res.status(400).json(createErrorResponse("Validation failed", validationErrors));
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json(createErrorResponse(MESSAGES.USER_EXISTS));
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username,
      password: hashedPassword,
      email,
      userCart: [],
      createdAt: new Date(),
    });
    
    if (!user) {
      return res.status(500).json(createErrorResponse(MESSAGES.USER_CREATION_ERROR));
    }

    res.status(201).json(createSuccessResponse(MESSAGES.USER_CREATED));
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json(createErrorResponse(MESSAGES.SIGNUP_ERROR));
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email
      },
      process.env.VITE_JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
};

export const deleteThisProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user.userCart.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart"
      });
    }

    user.userCart = user.userCart.filter(id => id.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.userCart
    });
  } catch (error) {
    console.error('Delete from cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Error removing product from cart"
    });
  }
};

export const cartProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findOne({ email: userId }).populate('userCart');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      cart: user.userCart
    });
  } catch (error) {
    console.error('Cart products error:', error);
    return res.status(500).json({ message: "Error fetching cart items" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if the product is already in the cart
    if (!user.userCart.includes(productId)) {
      user.userCart.push(productId);
      await user.save();
    }

    const updatedUser = await UserModel.findById(userId).populate('userCart');

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.userCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding product to cart"
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.user.email})
      .populate('userCart');

    return res.status(200).json({
      success: true,
      cart: user.userCart
    });
  } catch (error) {
    console.error('Get cart items error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching cart items"
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The user will be available from the auth middleware
    const user = req.user;
    
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await UserModel.findOne({ email: userId });
    if (!user.userCart.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart"
      });
    }

    user.userCart = user.userCart.filter(id => id.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.userCart
    });
  } catch (error) {
    console.error('Delete from cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Error removing product from cart"
    });
  }
};
