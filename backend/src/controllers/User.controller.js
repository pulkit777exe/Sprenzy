import { UserModel } from "../models/User.models.js";
import { ProductModel } from "../models/Product.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import { CartModel } from "../models/Cart.models.js";

const JWT_SECRET = process.env.JWT_SECRET || "thankyou for telling";
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

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_AUTH_CLIENT_ID);

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
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { 
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin || false
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred during sign-in"
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
    const userId = req.user._id;
    const productId = req.params.id;
    const { quantity = 1 } = req.body;
    
    const product = await ProductModel.findById(productId);
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.userCart) {
      user.userCart = [];
    }

    const existingItem = user.userCart.find(item => 
      item.productId && item.productId.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      user.userCart.push({
        productId,
        quantity: parseInt(quantity)
      });
    }

    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cartItemCount: user.userCart.length
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding product to cart",
      error: error.message
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // If userCart is an array of product IDs, populate them
    if (user.userCart && user.userCart.length > 0) {
      // Check if userCart contains objects with productId or just product IDs
      const isObjectArray = typeof user.userCart[0] === 'object' && user.userCart[0] !== null;
      
      let populatedCart;
      if (isObjectArray) {
        // If userCart contains objects with productId
        const productIds = user.userCart.map(item => item.productId);
        const products = await ProductModel.find({ _id: { $in: productIds } });
        
        // Map products to include quantity
        populatedCart = user.userCart.map(cartItem => {
          const productDetails = products.find(p => p._id.toString() === cartItem.productId.toString());
          return {
            ...cartItem.toObject(),
            productDetails: productDetails ? productDetails.toObject() : null
          };
        });
      } else {
        // If userCart is just an array of product IDs
        populatedCart = await ProductModel.find({ _id: { $in: user.userCart } });
      }
      
      return res.status(200).json({
        success: true,
        message: "Cart products retrieved successfully",
        products: populatedCart
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Cart is empty",
      products: []
    });
  } catch (error) {
    console.error('Get cart products error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching cart products"
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: "Error verifying token"
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const initialCartLength = user.userCart.length;
    user.userCart = user.userCart.filter(item => 
      item.productId.toString() !== productId
    );
    
    if (user.userCart.length === initialCartLength) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart"
      });
    }

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

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_AUTH_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      const username = name.replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      user = await UserModel.create({
        username,
        email,
        googleId,
        avatar: picture || undefined
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (picture) user.avatar = picture;
      await user.save();
    }
    
    const token = user.generateAuthToken();
    
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { quantity } = req.body;
        
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    const cartItem = user.userCart.find(item => 
      item.productId.toString() === productId
    );
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }
    
    cartItem.quantity = parseInt(quantity);
    await user.save();
        
    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated"
    });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating cart item quantity",
      error: error.message
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await UserModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile"
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, phone, fullName } = req.body;
    
    // Find user
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (fullName) user.fullName = fullName;
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      fullName, 
      streetAddress, 
      city, 
      state, 
      postalCode, 
      country = 'India', 
      phone,
      isDefault 
    } = req.body;
    
    // Validate required fields
    if (!fullName || !streetAddress || !city || !state || !postalCode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this is the first address or isDefault is true, update all other addresses
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Add new address
    user.addresses.push({
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    });
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding address"
    });
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    const { 
      fullName, 
      streetAddress, 
      city, 
      state, 
      postalCode, 
      country, 
      phone,
      isDefault 
    } = req.body;
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Find the address to update
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }
    
    // Update address fields if provided
    if (fullName) user.addresses[addressIndex].fullName = fullName;
    if (streetAddress) user.addresses[addressIndex].streetAddress = streetAddress;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (postalCode) user.addresses[addressIndex].postalCode = postalCode;
    if (country) user.addresses[addressIndex].country = country;
    if (phone) user.addresses[addressIndex].phone = phone;
    
    // Handle default address
    if (isDefault) {
      user.addresses.forEach((addr, idx) => {
        addr.isDefault = idx === addressIndex;
      });
    }
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating address"
    });
  }
};

export const deleteUserAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Find the address to delete
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }
    
    // Check if it's the default address
    const isDefault = user.addresses[addressIndex].isDefault;
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If it was the default address and there are other addresses, set a new default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({
      success: false,
      message: "Error deleting address"
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;
    
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Find user's cart or create one
    let userCart = await CartModel.findOne({ user: userId });
    
    if (!userCart) {
      userCart = await CartModel.create({
        user: userId,
        items: []
      });
    }
    
    // Check if product already in cart
    const existingItemIndex = userCart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      userCart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new product to cart
      userCart.items.push({
        product: productId,
        quantity: parseInt(quantity)
      });
    }
    
    // Calculate total price
    userCart.totalPrice = userCart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    
    await userCart.save();
    
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: userCart
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message
    });
  }
};
