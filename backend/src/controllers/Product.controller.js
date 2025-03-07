import { ProductModel } from "../models/Product.models.js";
import { UserModel } from "../models/User.models.js";

export const createProduct = async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    const { name, title, description, brand, price, imageUrl, category, amazonUrl, stock } = req.body;
    
    // Use either name or title (whichever is provided)
    const productTitle = title || name;
    
    // Validate required fields
    if (!productTitle || !description || !price || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title/name, description, price, imageUrl, and category are required"
      });
    }
    
    // Validate price and stock
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }
    
    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer"
      });
    }
    
    // Create the product
    const newProduct = new ProductModel({
      title: productTitle, // Use the title field as in your schema
      description,
      brand,
      price: parseFloat(price),
      imageUrl,
      category,
      amazonUrl,
      stock: parseInt(stock)
    });
    
    await newProduct.save();
    
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Delete the product
    await ProductModel.findByIdAndDelete(productId);
    
    // Also remove this product from all user carts
    await UserModel.updateMany(
      { "userCart.productId": productId },
      { $pull: { userCart: { productId: productId } } }
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    });
  }
};

export const updateProducts = async (req, res) => {
  const { id } = req.params;
  const { title, description, brand, price, category, imageUrl, amazonUrl } =
    req.body;
  const userId = req.user ? req.user.userId : null;

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized. User not logged in.",
    });
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        error: "Access denied. Admins only.",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        brand,
        price,
        category,
        imageUrl,
        amazonUrl,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.status(200).json({
      success: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the product" });
  }
};

export const viewAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products"
    });
  }
};

export const fetchFeaturedProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().limit(12);
    console.log("Fetching featured products");

    if (products.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching products" });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products"
    });
  }
};

export const viewUserProducts = async (req, res) => {
  const email = req.body.email;
  if(!email) {
    res.status(403).json({
      error: "You are not signed in"
    })
  }

  try{
    const user = UserModel.find({email: email});

    if(!user) {
      res.status(403).json({
        error: "User not found"
      })
    }

    const products = await UserModel.findById(req.user._id).populate(
      "userCart"
    );
    res.json(products);
  } catch(error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error"
    })
  }
};
