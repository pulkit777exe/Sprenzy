import axios from 'axios';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CartProductCard = ({
  product, 
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/user/cart/${product._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      onDelete(product._id);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
      <div className="flex gap-4">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-16 h-16 object-cover rounded-lg" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'path/to/fallback-image.jpg'; }}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
          <p className="text-gray-600 text-sm">₹{product.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white rounded-full"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => window.open(product.amazonUrl, '_blank')}
          className="p-2 bg-amber-500 text-white rounded-full"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const deleteProduct = async (productId) => {
  try {
    setProducts(products.filter(product => product._id !== productId));
    toast.success("Product removed from cart");
  } catch (error) {
    console.error("Error updating cart:", error);
    toast.error("Failed to remove product from cart");
  }
};

export const deleteThisProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    console.log('User ID:', userId);
    console.log('Product ID:', productId);

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.userCart.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart"
      });
    }

    user.userCart = user.userCart.filter(id => id.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.userCart
    });
  } catch (error) {
    console.error('Delete from cart error:', error);
    return res.status(500).json({
      success: false,
      message: "Error removing product from cart"
    });
  }
};
