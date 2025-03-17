import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import { LazyImage } from './LazyImage';

// Memoize the component for better performance
const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Stop event propagation
    
    try {
      if (!user) {
        toast.error('Please sign in to add items to your cart');
        navigate('/signin');
        return;
      }
      
      setAddingToCart(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/addProduct/${product._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        navigate('/signin');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <LazyImage
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              title="Add to cart"
              disabled={addingToCart}
            >
              {addingToCart ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="p-4">
          
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">₹{product.price}</span>
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export { ProductCard };
