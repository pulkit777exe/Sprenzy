import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';

export const cleanupInvalidCartItems = async () => {
  try {
    // Get all users with non-empty carts
    const users = await UserModel.find({ "userCart.0": { $exists: true } });

    for (const user of users) {
      // Get all product IDs in the user's cart
      const productIds = user.userCart.map(item => item.productId);

      // Find which products still exist
      const existingProducts = await ProductModel.find({
        _id: { $in: productIds }
      });

      const existingProductIds = existingProducts.map(p => p._id.toString());

      // Filter out cart items with non-existent products
      user.userCart = user.userCart.filter(item => 
        existingProductIds.includes(item.productId.toString())
      );

      await user.save();
    }

    console.log('Cart cleanup completed successfully');
  } catch (error) {
    console.error('Cart cleanup error:', error);
  }
}; 