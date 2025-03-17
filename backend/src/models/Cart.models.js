import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const CartModel = mongoose.model('Cart', cartItemSchema);

export{ CartModel }; 