import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/products`, { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary mb-10 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 

            key={product.id}
        
            title={product.title}
        
            description={product.description}
        
            price={product.price}
        
            imageUrl={product.imageUrl}
        
            amazonUrl={product.amazonUrl}
         />
          ))}
        </div>
      </div>
    </div>
  );
};
