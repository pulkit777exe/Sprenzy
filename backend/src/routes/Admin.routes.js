import { ProductModel } from "../models/Product.models.js";
import { UserModel } from "../models/User.models.js";
import express from "express";
import isValid  from "../middleware/isValid.js";

const adminRouter = express.Router();
adminRouter.use(isValid);

adminRouter.post("/create-products", async (req, res) => {
    const { title, description, brand, price, category, imageUrl, amazonUrl } = req.body;

    if (!title || !description || !brand || !price || !category || !imageUrl || !amazonUrl) {
        return res.status(400).json({
            error: "Provide all required arguments"
        });
    }
    const { userId } = req.user || {};
    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized. User not logged in."
        });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                error: "Access denied. Admins only."
            });
        }

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
            success: "Product added successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while adding the product" });
    }
});

export { adminRouter };
