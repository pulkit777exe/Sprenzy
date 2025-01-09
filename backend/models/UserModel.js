import { Schema, Model } from "mongoose";
import { z } from "zod";

const UserSchema = new Schema(z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8),
    email: z.string().email(),
    isAdmin: z.boolean()
}))

export const UserModel = Model(UserSchema,"User");