import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);  // Added error state

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/product/featuredProducts`,
        { withCredentials: true }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching products. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary mb-10 text-center">
          Featured Products
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>} {/* Display error message if exists */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-4">No products available</p> // Display message if no products
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                title={product.title}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                amazonUrl={product.amazonUrl}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
