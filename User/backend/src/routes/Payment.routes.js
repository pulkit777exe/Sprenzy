import { Router } from 'express';
import { 
  createCheckoutSession, 
  checkoutSuccess, 
  stripeWebhook 
} from '../Controller/Payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';

const paymentRouter = Router();

// Route to create a checkout session
paymentRouter.post('/create-checkout-session', verifyJWT, createCheckoutSession);

// Route for successful checkout (to clear cart)
paymentRouter.post('/checkout-success', verifyJWT, checkoutSuccess);

// Webhook route for Stripe events
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export { paymentRouter }; 