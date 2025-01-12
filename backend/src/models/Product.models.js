import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    amazonUrl: { type: String, required: true }
}, { timestamps: true });

export const ProductModel = model("Products", ProductSchema);