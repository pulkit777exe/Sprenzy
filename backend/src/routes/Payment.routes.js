import { Router } from 'express';
import { 
  createCheckoutSession, 
  checkoutSuccess,
  createPayoneerPayment,
  handlePayoneerWebhook
} from '../controllers/Payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

paymentRouter.post('/create-checkout-session', verifyJWT, createCheckoutSession);
paymentRouter.post('/checkout-success', verifyJWT, checkoutSuccess);
paymentRouter.post('/payoneer', verifyJWT, createPayoneerPayment);
paymentRouter.post('/payoneer/webhook', handlePayoneerWebhook);

export { paymentRouter }; 