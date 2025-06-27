import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';
import { OrderModel } from "../models/Order.models.js";
import axios from 'axios';

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

    const shippingCost = totalAmount < 500 ? 100 : 0;
    totalAmount += shippingCost;
    
    const taxAmount = totalAmount * 0.18;
    totalAmount += taxAmount;
    
    totalAmount = Math.round(totalAmount * 100) / 100;
    
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
    const { amount, currency, description, successUrl, cancelUrl } = req.body;
    const userId = req.user._id;

    // Create order first
    const order = await OrderModel.create({
      user: userId,
      totalAmount: amount,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING'
    });

    // Create Payoneer payment
    const payoneerResponse = await axios.post(
      'https://api.payoneer.com/v2/payments',
      {
        amount,
        currency,
        description,
        order_id: order._id.toString(),
        success_url: successUrl,
        cancel_url: cancelUrl
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYONEER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.json({
      success: true,
      paymentUrl: payoneerResponse.data.redirect_url,
      orderId: order._id
    });
  } catch (error) {
    console.error('Payoneer payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment'
    });
  }
};

export const handlePayoneerWebhook = async (req, res) => {
  try {
    const { order_id, status, transaction_id } = req.body;

    const order = await OrderModel.findById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = status === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
    order.transactionId = transaction_id;
    await order.save();

    if (status === 'COMPLETED') {
      // Clear user's cart after successful payment
      await UserModel.findByIdAndUpdate(order.user, { userCart: [] });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false });
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