import { Router } from 'express';
import { 
  createCheckoutSession, 
  checkoutSuccess,
  paytmCallback,
  initiatePaytmPayment
} from '../controllers/Payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

paymentRouter.post('/create-checkout-session', verifyJWT, createCheckoutSession);
paymentRouter.post('/checkout-success', verifyJWT, checkoutSuccess);
paymentRouter.post('/paytm', verifyJWT, initiatePaytmPayment);
paymentRouter.post('/paytm/callback', paytmCallback);

export { paymentRouter }; 