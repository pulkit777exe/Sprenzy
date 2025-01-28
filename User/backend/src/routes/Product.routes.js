import{ Router } from "express";
import { createProduct, deleteProducts, fetchFeaturedProducts, updateProducts, viewAllProducts, viewUserProducts } from "../Controller/Product.controller.js";

const productRouter = Router();

productRouter.post("/create-products", createProduct);
productRouter.delete("/delete-product/:id", deleteProducts);    
productRouter.put("/update-product/:id", updateProducts);
productRouter.get("/products", viewAllProducts);
productRouter.get("/featuredProducts", fetchFeaturedProducts)
productRouter.get("/userProducts", viewUserProducts);

export { productRouter };