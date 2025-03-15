import { ProductCard } from "./ProductCard";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { ShoppingBag } from 'lucide-react';

export const ProductGrid = ({ products = [], loading = false, error = null, showHeading = false, title = "Featured Products" }) => {
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
        `${import.meta.env.VITE_BACKEND_API_URL}/user/addProduct/${productId}`,
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

  const memoizedProducts = useMemo(() => {
    return products.map(product => (
      <ProductCard
        key={product._id}
        product={product}
        onAddToCart={() => handleAddToCart(product._id)}
      />
    ));
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent absolute top-0 left-0 opacity-40"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Failed to load products</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showHeading && (
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memoizedProducts}
      </div>
    </div>
  );
};