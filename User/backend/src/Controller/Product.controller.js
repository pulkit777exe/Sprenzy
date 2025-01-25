import { ProductModel } from "../models/Product.models.js";
import { UserModel } from "../models/User.models.js";

const createProduct = async (req, res) => {
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
      error: "Provide all required arguments",
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
      success: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the product" });
  }
};

const deleteProducts = async (req, res) => {
  const { id } = req.params;
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

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.status(200).json({
      success: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
};

const updateProducts = async (req, res) => {
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

const viewAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

const viewUserProducts = async (req, res) => {
  try {
    const products = await UserModel.findById(req.user._id).populate(
      "userCart"
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export  {
  createProduct,
  deleteProducts,
  updateProducts,
  viewAllProducts,
  viewUserProducts,
};
