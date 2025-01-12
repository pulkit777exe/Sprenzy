import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export const UserModel = model("User", UserSchema);