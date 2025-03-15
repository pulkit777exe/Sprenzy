import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';
import { OrderModel } from "../models/Order.models.js";
import axios from 'axios';

// Check if Payoneer credentials are configured
if (!process.env.PAYONEER_MERCHANT_ID || !process.env.PAYONEER_API_KEY) {
  console.warn('Warning: Payoneer credentials not properly configured. Payment functionality may be limited.');
}

export const createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.PAYONEER_MERCHANT_ID || !process.env.PAYONEER_API_KEY) {
      console.error('Payoneer credentials missing');
      return res.status(503).json({
        success: false,
        message: 'Payment system is not properly configured. Please try again later.'
      });
    }

    const userId = req.user._id;
    const { successUrl, cancelUrl, addressId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.userCart || user.userCart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }
    
    let shippingAddress;
    if (addressId) {
      shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
    } else {
      shippingAddress = user.addresses.find(addr => addr.isDefault);
    }
    
    if (!shippingAddress && user.addresses.length > 0) {
      shippingAddress = user.addresses[0];
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please add a shipping address before checkout'
      });
    }

    const productIds = user.userCart.map(item => item.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    const items = [];

    products.forEach(product => {
      const cartItem = user.userCart.find(item => 
        item.productId.toString() === product._id.toString()
      );
      
      if (cartItem) {
        const quantity = cartItem.quantity || 1;
        const price = product.price;
        totalAmount += price * quantity;
        
        items.push({
          productId: product._id,
          title: product.title,
          price: price,
          quantity: quantity
        });
      }
    });
    
    // Add shipping cost if total is less than 500
    const shippingCost = totalAmount < 500 ? 100 : 0;
    totalAmount += shippingCost;
    
    // Add tax (18%)
    const taxAmount = totalAmount * 0.18;
    totalAmount += taxAmount;
    
    // Round to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;
    
    // Create order in database
    const order = new OrderModel({
      user: userId,
      products: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalAmount,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      shippingAddress: {
        name: shippingAddress.name || user.username,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India'
      }
    });
    
    await order.save();
    
    // Redirect to Payoneer checkout
    return res.status(200).json({
      success: true,
      orderId: order._id,
      redirectUrl: `/checkout?orderId=${order._id}`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: "Error creating checkout session",
      error: error.message
    });
  }
};

export const createPayoneerPayment = async (req, res) => {
  try {
    const { items, amount, userId } = req.body;
    
    if (!items || !items.length || !amount) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Items and amount are required."
      });
    }
    
    // Create an order in your database
    const order = new OrderModel({
      user: userId || req.user._id,
      products: items.map(item => ({
        product: item.productId || item._id,
        quantity: item.quantity || 1,
        price: item.price || 0
      })),
      totalAmount: amount,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING'
    });
    
    await order.save();
    
    // Generate a unique order ID
    const orderId = order._id.toString();
    
    // Payoneer API integration
    // Note: This is a simplified example. You'll need to use Payoneer's actual API
    const payoneerPayload = {
      merchant_id: process.env.PAYONEER_MERCHANT_ID,
      amount: amount,
      currency: 'INR',
      order_id: orderId,
      description: `Order #${orderId}`,
      customer_email: req.user.email,
      redirect_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/failure?orderId=${orderId}`,
      webhook_url: `${process.env.BACKEND_URL}/api/v1/payment/payoneer/webhook`
    };
    
    // In a real implementation, you would call Payoneer's API here
    // For now, we'll simulate a successful response
    
    // Simulate Payoneer payment URL
    const paymentUrl = `https://payoneer.com/pay?order=${orderId}&amount=${amount}`;
    
    return res.status(200).json({
      success: true,
      orderId: orderId,
      paymentUrl: paymentUrl
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({
      success: false,
      message: "Error initiating payment",
      error: error.message
    });
  }
};

export const payoneerWebhook = async (req, res) => {
  try {
    const { order_id, status, transaction_id } = req.body;
    
    if (!order_id || !status) {
      return res.status(400).json({ success: false, message: 'Invalid webhook data' });
    }
    
    if (status === 'COMPLETED') {
      await OrderModel.findByIdAndUpdate(
        order_id,
        {
          paymentStatus: 'COMPLETED',
          orderStatus: 'PROCESSING',
          transactionId: transaction_id,
          paymentDetails: req.body
        }
      );
      
      // Clear user's cart
      const order = await OrderModel.findById(order_id);
      if (order && order.user) {
        await UserModel.findByIdAndUpdate(
          order.user,
          { userCart: [] }
        );
      }
    } else if (status === 'FAILED') {
      await OrderModel.findByIdAndUpdate(
        order_id,
        {
          paymentStatus: 'FAILED',
          paymentDetails: req.body
        }
      );
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payoneer webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }
    
    const order = await OrderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Update order status
    order.paymentStatus = 'COMPLETED';
    order.orderStatus = 'PROCESSING';
    await order.save();
    
    // Clear user's cart
    await UserModel.findByIdAndUpdate(
      order.user,
      { userCart: [] }
    );
    
    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      order
    });
  } catch (error) {
    console.error('Checkout success error:', error);
    return res.status(500).json({
      success: false,
      message: "Error processing successful checkout",
      error: error.message
    });
  }
}; 