import { UserModel } from '../models/User.models.js';
import { ProductModel } from '../models/Product.models.js';

export const cleanupInvalidCartItems = async () => {
  try {
    const users = await UserModel.find({ "userCart.0": { $exists: true } });

    for (const user of users) {
      const productIds = user.userCart.map(item => item.productId);
      const existingProducts = await ProductModel.find({
        _id: { $in: productIds }
      });

      const existingProductIds = existingProducts.map(p => p._id.toString());
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