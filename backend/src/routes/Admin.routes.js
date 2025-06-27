import { Router } from 'express';
import { verifyJWT, isAdmin } from '../middleware/auth.middleware.js';
import { cleanupInvalidCartItems } from '../utils/cartCleanup.js';

const adminRouter = Router();

adminRouter.post('/cleanup-carts', verifyJWT, isAdmin, async (req, res) => {
  try {
    await cleanupInvalidCartItems();
    res.status(200).json({
      success: true,
      message: 'Cart cleanup completed successfully'
    });
  } catch (error) {
    console.error('Cart cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up carts',
      error: error.message
    });
  }
});

export { adminRouter }; 