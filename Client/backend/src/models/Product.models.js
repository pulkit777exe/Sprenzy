import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    imageUrl: { type: String, required: true },
    amazonUrl: { type: String, required: true }
}, { timestamps: true });

export const ProductModel = model("Products", ProductSchema);