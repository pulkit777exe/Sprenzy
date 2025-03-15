import { Router } from "express";
import { 
  createProduct,  
  getFeaturedProducts, 
  updateProducts, 
  viewAllProducts, 
  viewUserProducts,
  fetchAllProducts,
  deleteProduct,
  getProductById
} from "../controllers/Product.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.get("/all-products", fetchAllProducts);
productRouter.get("/products", viewAllProducts);
productRouter.get("/featuredProducts", getFeaturedProducts);
productRouter.get("/:productId", getProductById);

productRouter.get("/userProducts", verifyJWT, viewUserProducts);

productRouter.post("/create-products", verifyJWT, isAdmin, createProduct);
productRouter.delete("/delete-product/:productId", verifyJWT, isAdmin, deleteProduct);
productRouter.put("/update-product/:id", verifyJWT, isAdmin, updateProducts);

export default productRouter;