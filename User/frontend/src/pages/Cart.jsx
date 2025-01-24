import { useState, useEffect } from 'react';
import axios from 'axios';
import { CartProductCard } from '../components/CartProductCard';

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to delete a product from the cart
  async function deleteProduct(productId) {
    try {
      await axios.delete(`http://localhost:3000/api/v1/user/deleteProduct/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  // Fetch the products in the cart when the component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/user/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Ensure that all product prices are numbers and safely calculate the total
  const totalPrice = products.reduce((acc, product) => acc + (product.price || 0), 0).toFixed(2);

  return (
    <div className="w-screen min-h-screen bg-amber-50">
      <h1 className="text-3xl text-center font-bold p-4">Cart Page</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-xl">Loading...</span>
        </div>
      ) : (
        <div className="mx-auto p-4 flex justify-around">
          {/* Product List Section */}
          <div className="flex flex-col gap-4 w-2/3">
            {products.length === 0 ? (
              <p className="text-center text-xl">Your cart is empty</p>
            ) : (
              products.map((product) => (
                <CartProductCard
                  key={product._id}
                  product={product}
                  deleteProduct={deleteProduct}
                />
              ))
            )}
          </div>

          {/* Checkout Section */}
          <div className="border border-gray-300 p-4 bg-white rounded-lg w-1/3">
            <div className="text-center text-xl font-bold">
              Total
              <hr className="m-4" />
              {products.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="flex justify-between py-1">
                    <p>{product.title}</p>
                    <p>₹{(product.price || 0).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <hr className="m-4" />

            <div className="text-right mt-4">
              <div className="flex justify-between">
                <div className="font-bold">₹{totalPrice}</div>
                <div>{products.length} items</div>
              </div>
              <button className="bg-primary rounded-xl hover:bg-amber-500 text-white px-4 py-2 mt-4">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
