import { ProductModel } from "../models/Product.models.js";
import { UserModel } from "../models/User.models.js";

export const createProduct = async (req, res) => {
  const { title, description, brand, price, category, imageUrl, amazonUrl } =
    req.body;

  if (
    !title ||
    !description ||
    !brand ||
    !price ||
    !category ||
    !imageUrl ||
    !amazonUrl
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide all required fields",
    });
  }

  try {
    const product = new ProductModel({
      title,
      description,
      brand,
      price,
      category,
      imageUrl,
      amazonUrl,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ 
        success: false,
        message: "An error occurred while adding the product" 
      });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product"
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
