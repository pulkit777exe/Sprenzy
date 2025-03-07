import PaytmChecksum from 'paytmchecksum';
import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';
import Cart from '../models/Cart.js'; // Assuming you have a Cart model
import { OrderModel } from "../models/Order.models.js";
import https from 'https';

// At the top of the file, add environment variable validation
if (!process.env.PAYTM_MID || !process.env.PAYTM_MERCHANT_KEY) {
  console.warn('Warning: Paytm credentials not properly configured. Payment functionality may be limited.');
}

// Use fallback empty strings if environment variables are not set
const PAYTM_MID = process.env.PAYTM_MID;
const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE || 'WEBSTAGING';
const PAYTM_INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE || 'Retail';
const PAYTM_CHANNEL_ID = process.env.PAYTM_CHANNEL_ID || 'WEB';

const PAYTM_ENABLED = !!(PAYTM_MID && PAYTM_MERCHANT_KEY);

// Add this constant for the callback URL
const PAYTM_CALLBACK_URL = process.env.NODE_ENV === 'production'
  ? `${process.env.BACKEND_URL}/api/payment/paytm-callback`
  : 'http://localhost:3000/api/payment/paytm-callback';

export const createCheckoutSession = async (req, res) => {
  try {
    // Check if Paytm credentials are configured
    if (!PAYTM_MID || !PAYTM_MERCHANT_KEY) {
      console.error('Paytm credentials missing:', { PAYTM_MID, PAYTM_MERCHANT_KEY });
      return res.status(503).json({
        success: false,
        message: 'Payment system is not properly configured. Please try again later.'
      });
    }

    const userId = req.user._id;
    const { successUrl, cancelUrl, addressId } = req.body;

    // Find the user with their cart
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If cart is empty
    if (!user.userCart || user.userCart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }
    
    // Get shipping address
    let shippingAddress;
    if (addressId) {
      shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
    } else {
      // Get default address
      shippingAddress = user.addresses.find(addr => addr.isDefault);
    }
    
    if (!shippingAddress && user.addresses.length > 0) {
      // Use first address if no default
      shippingAddress = user.addresses[0];
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please add a shipping address before checkout'
      });
    }

    // Get products from cart
    const productIds = user.userCart.map(item => item.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Calculate total amount
    let totalAmount = 0;
    products.forEach(product => {
      const cartItem = user.userCart.find(
        item => item.productId.toString() === product._id.toString()
      );
      totalAmount += parseFloat(product.price) * (cartItem ? cartItem.quantity : 1);
    });

    // Generate a unique order ID
    const orderId = 'ORDER_' + Date.now();

    // Prepare parameters for Paytm
    const paytmParams = {
      MID: PAYTM_MID,
      WEBSITE: PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: PAYTM_INDUSTRY_TYPE,
      CHANNEL_ID: PAYTM_CHANNEL_ID,
      ORDER_ID: orderId,
      CUST_ID: userId.toString(),
      TXN_AMOUNT: totalAmount.toString(),
      EMAIL: user.email,
      CALLBACK_URL: PAYTM_CALLBACK_URL,
      MOBILE_NO: user.phone || ''
    };

    // Generate checksum
    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      PAYTM_MERCHANT_KEY
    );

    paytmParams.CHECKSUMHASH = checksum;

    res.status(200).json({
      success: true,
      params: paytmParams,
      txnUrl: process.env.NODE_ENV === 'production'
        ? 'https://securegw.paytm.in/theia/processTransaction'
        : 'https://securegw-stage.paytm.in/theia/processTransaction',
      orderId: orderId,
      amount: totalAmount,
      metadata: {
        userId: userId.toString(),
        addressId: shippingAddress._id.toString()
      }
    });
  } catch (error) {
    console.error('Paytm checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
};

export const paytmCallback = async (req, res) => {
  try {
    const paytmParams = {};
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        paytmParams[key] = req.body[key];
      }
    }

    const isVerified = await PaytmChecksum.verifySignature(
      paytmParams,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );

    if (isVerified) {
      // Payment successful
      if (paytmParams.STATUS === 'TXN_SUCCESS') {
        // Update order status
        await OrderModel.findByIdAndUpdate(
          paytmParams.ORDERID,
          {
            paymentStatus: 'COMPLETED',
            orderStatus: 'PROCESSING',
            transactionId: paytmParams.TXNID,
            paymentDetails: paytmParams
          }
        );
        
        // Clear user's cart
        const order = await OrderModel.findById(paytmParams.ORDERID);
        if (order && order.user) {
          await UserModel.findByIdAndUpdate(
            order.user,
            { userCart: [] }
          );
        }
        
        // Redirect to success page
        return res.redirect(`${process.env.VITE_APP_URL}/payment/success?orderId=${paytmParams.ORDERID}`);
      } else {
        // Payment failed
        await OrderModel.findByIdAndUpdate(
          paytmParams.ORDERID,
          {
            paymentStatus: 'FAILED',
            paymentDetails: paytmParams
          }
        );
        
        // Redirect to failure page
        return res.redirect(`${process.env.VITE_APP_URL}/payment/failure?orderId=${paytmParams.ORDERID}`);
      }
    } else {
      // Checksum mismatch
      return res.redirect(`${process.env.VITE_APP_URL}/payment/failure?reason=checksum_failed`);
    }
  } catch (error) {
    console.error('Paytm callback error:', error);
    return res.redirect(`${process.env.VITE_APP_URL}/payment/failure?reason=server_error`);
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Cart should already be cleared in the callback, but we'll do it again just to be sure
    await UserModel.findByIdAndUpdate(userId, { userCart: [] });
    
    res.status(200).json({
      success: true,
      message: 'Payment successful and cart cleared'
    });
  } catch (error) {
    console.error('Checkout success error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing successful checkout',
      error: error.message
    });
  }
};

// Add this function to fetch cart items
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user authentication
    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
};

// Add this function to handle Paytm payment initiation
export const initiatePaytmPayment = async (req, res) => {
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
    
    // Prepare Paytm parameters
    const paytmParams = {
      MID: process.env.PAYTM_MID,
      WEBSITE: process.env.PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
      ORDER_ID: orderId,
      CUST_ID: userId || req.user._id.toString(),
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${process.env.BACKEND_URL}/api/v1/payment/paytm/callback`,
      EMAIL: req.user.email || '',
      MOBILE_NO: ''
    };
    
    // Generate checksum
    const paytmChecksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams), 
      process.env.PAYTM_MERCHANT_KEY
    );
    
    paytmParams.CHECKSUMHASH = paytmChecksum;
    
    // For production
    if (process.env.NODE_ENV === 'production') {
      return res.status(200).json({
        success: true,
        params: paytmParams,
        formHtml: generatePaytmForm(paytmParams)
      });
    } else {
      // For development/testing - use Paytm staging API
      const paytmTxnUrl = 'https://securegw-stage.paytm.in/theia/processTransaction';
      return res.status(200).json({
        success: true,
        params: paytmParams,
        paymentUrl: `${paytmTxnUrl}?${new URLSearchParams(paytmParams).toString()}`,
        formHtml: generatePaytmForm(paytmParams, paytmTxnUrl)
      });
    }
  } catch (error) {
    console.error('Paytm payment error:', error);
    return res.status(500).json({
      success: false,
      message: "Error initiating payment",
      error: error.message
    });
  }
};

// Helper function to generate Paytm form
const generatePaytmForm = (params, url = 'https://securegw-stage.paytm.in/theia/processTransaction') => {
  let formHtml = `<form id="paytmForm" action="${url}" method="post">`;
  
  for (const key in params) {
    formHtml += `<input type="hidden" name="${key}" value="${params[key]}">`;
  }
  
  formHtml += '</form>';
  return formHtml;
}; 