import { ProductCard } from "./ProductCard";
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export const ProductGrid = ({ products = [], loading = false, error = null }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setAddingToCart(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/user/addProduct/${productId}`,
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

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent absolute top-0 left-0 opacity-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Featured Products
      </h2>

      {error ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Products</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.length === 0 ? (
            <p className="text-center col-span-full text-gray-600 py-10">
              No products available at the moment
            </p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                {...product}
                onAddToCart={() => handleAddToCart(product._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};