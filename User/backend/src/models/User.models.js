import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define address schema
const addressSchema = new Schema({
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

// Define cart item schema to include quantity
const cartItemSchema = new Schema({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: 1 
  }
});

const UserSchema = new Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 30 },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  userCart: [cartItemSchema],
  addresses: [addressSchema],
  phone: { type: String },
  fullName: { type: String }
}, { timestamps: true });

UserSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.VITE_JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const UserModel = model('User', UserSchema);