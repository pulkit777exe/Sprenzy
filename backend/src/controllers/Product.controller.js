import { ProductModel } from "../models/Product.models.js";
import { UserModel } from "../models/User.models.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      additionalImages,
      category,
      brand,
      stock,
      featured,
      amazonUrl,
      specifications
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !imageUrl || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const newProduct = new ProductModel({
      title,
      description,
      price,
      imageUrl,
      additionalImages: additionalImages || [],
      category,
      brand,
      stock: stock || 10,
      featured: featured || false,
      amazonUrl,
      specifications: specifications || []
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
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
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
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

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await ProductModel.find({ featured: true }).lean();
    
    if (featuredProducts.length === 0) {
      featuredProducts = await ProductModel.find().limit(8).lean();
    }
    
    return res.status(200).json({
      success: true,
      products: featuredProducts
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message
    });
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

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await ProductModel.findById(productId).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseInt(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseInt(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    n
    const products = await ProductModel.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const totalProducts = await ProductModel.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalProducts / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};
