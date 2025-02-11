import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const ProductCard = ({
  _id,
  title,
  description,
  price,
  imageUrl,
  amazonUrl,
  brand,
  onAddToCart
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/user/addProduct/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Add to cart response:", response.data);
      onAddToCart(_id);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <img
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          src={imageUrl}
          alt={title}
        />
        {amazonUrl && (
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-lg hover:bg-white transition-colors shadow-md"
            title="View on Amazon"
          >
            <ExternalLink className="w-4 h-4 text-primary" />
          </a>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {title}
          </h3>
          {brand && (
            <p className="text-sm text-gray-500">{brand}</p>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{parseFloat(price).toFixed(2)}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
