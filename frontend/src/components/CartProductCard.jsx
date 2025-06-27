import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Trash2, ExternalLink, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

export const CartProductCard = ({
  product, 
  onDelete,
  onUpdateQuantity,
}) => {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (product.quantity) {
      setQuantity(product.quantity);
    }
  }, [product.quantity]);

  const handleDelete = async () => {
    try {
      const productId = product.productId || product._id;
      await api.delete(`/user/cart/${productId}`);
      onDelete(productId);
      toast.success('Product removed from cart');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to remove product');
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    setIsUpdating(true);
    
    try {
      const productId = product.productId || product._id;
      await api.put(`/user/cart/${productId}/quantity`, { quantity: newQuantity });
      onUpdateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      setQuantity(product.quantity || 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const {
    title = product.title || '',
    price = product.price || '0',
    imageUrl = product.imageUrl || 'https://placehold.co/600x400',
    amazonUrl = product.amazonUrl || '#',
    brand = product.brand || 'Unknown',
    description = product.description || 'No description available'
  } = product.productDetails || product || {};

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-20 h-20 object-cover rounded-lg" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400'; }}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm">{brand}</p>
            <p className="text-amber-600 font-bold mt-1">₹{price}</p>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={quantity <= 1 || isUpdating}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 text-center min-w-[40px]">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={isUpdating}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove from cart"
              disabled={isUpdating}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {amazonUrl && (
              <button 
                onClick={() => window.open(amazonUrl, '_blank')}
                className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                title="View on Amazon"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CartProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired
};
