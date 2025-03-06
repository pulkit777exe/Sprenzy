import { Router } from 'express';
import { 
  createCheckoutSession, 
  checkoutSuccess, 
  stripeWebhook 
} from '../controllers/Payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';

const paymentRouter = Router();

paymentRouter.post('/create-checkout-session', verifyJWT, createCheckoutSession);

paymentRouter.post('/checkout-success', verifyJWT, checkoutSuccess);

paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export { paymentRouter }; 