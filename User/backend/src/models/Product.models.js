import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    imageUrl: { type: String, required: true },
    amazonUrl: { type: String, required: true },
    user: {type: Schema.Types.ObjectId, ref: "User"}
}, { timestamps: true });

export const ProductModel = model("Product", ProductSchema);