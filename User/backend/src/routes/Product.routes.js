import{ Router } from "express";
import { createProduct, deleteProducts, updateProducts, viewAllProducts, viewUserProducts } from "../Controller/Product.controller.js";

const productRoutes = Router();

productRoutes.post("/create-products", createProduct);
productRoutes.delete("/delete-product/:id", deleteProducts);    
productRoutes.put("/update-product/:id", updateProducts);
productRoutes.get("/products", viewAllProducts);
productRoutes.get("/userProducts", viewUserProducts);

export default productRoutes;