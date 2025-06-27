import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  products: [{ 
    product: { 
      type: Schema.Types.ObjectId, 
      ref: "Product" 
    },
    quantity: { 
      type: Number, 
      default: 1 
    },
    price: { 
      type: Number, 
      required: true 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  orderStatus: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  transactionId: String,
  paymentDetails: Schema.Types.Mixed
}, { timestamps: true });

export const OrderModel = model("Order", OrderSchema); 