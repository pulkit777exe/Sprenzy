import Stripe from 'stripe';
import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';

// Use a fallback empty string if the environment variable is not set
// This prevents the immediate crash, though Stripe won't work without a real key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development');

const STRIPE_ENABLED = !!process.env.STRIPE_SECRET_KEY;

export const createCheckoutSession = async (req, res) => {
  try {
    if (!STRIPE_ENABLED) {
      return res.status(503).json({
        success: false,
        message: 'Payment system is currently unavailable. Please try again later.'
      });
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Payment system is not configured. Please contact the administrator.'
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

    // Map products to line items for Stripe
    const lineItems = products.map(product => {
      const cartItem = user.userCart.find(
        item => item.productId.toString() === product._id.toString()
      );
      
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.title,
            description: product.description,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(parseFloat(product.price) * 100), // Stripe needs cents/paise
        },
        quantity: cartItem ? cartItem.quantity : 1,
      };
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.VITE_APP_URL}/checkout-success`,
      cancel_url: cancelUrl || `${process.env.VITE_APP_URL}/cart`,
      customer_email: user.email,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      metadata: {
        userId: userId.toString(),
        addressId: shippingAddress._id.toString()
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Clear the user's cart after successful payment
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

export const stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Get the user ID from metadata
    const userId = session.metadata.userId;
    
    // Clear the user's cart
    await UserModel.findByIdAndUpdate(userId, { userCart: [] });
  }

  res.status(200).json({ received: true });
}; 