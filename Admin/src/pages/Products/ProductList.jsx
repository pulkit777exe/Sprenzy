import React, { useState, useEffect } from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import axios from "axios";

export default function ProductList({ products: initialProducts, onDelete }) {
  const [products, setProducts] = useState(initialProducts || []);

  useEffect(() => {
    if (!initialProducts?.length) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}api/v1/user/products`,
            { withCredentials: true }
          );
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, [initialProducts]);

  const handleDelete = (indexToDelete) => {
    const updatedProducts = products.filter((_, index) => index !== indexToDelete);
    setProducts(updatedProducts);
    
    onDelete?.(indexToDelete);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
              <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-primary">
                {product.category}
              </span>
              <div className="flex space-x-2">
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-green-500"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}