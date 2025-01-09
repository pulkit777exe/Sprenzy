import { Schema, Model } from "mongoose";
import { z } from "zod";

const ProductSchema = new Schema(z.object({
    name: z.string(),
    description: z.string(),
    brand: z.string(),
    price: z.number(),
    category: z.string(),
    imageUrl: z.string().url()
}))

export const ProductModel = Model(ProductSchema,"Products");