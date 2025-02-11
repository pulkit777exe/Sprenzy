import { useState, useEffect } from 'react';
import axios from 'axios';
import { CartProductCard } from '../components/CartProductCard'; // Make sure this component exists
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context
import { toast } from 'react-hot-toast'; // For error notifications
import { ShoppingCart, ArrowLeft } from 'lucide-react'; // Import icons
import { Link } from 'react-router'; // Correct import for react-router-dom
import { Navbar } from '../components/Navbar'; // Assuming Navbar is created

const API_URL = import.meta.env.VITE_BACKEND_API_URL; // Should be "http://localhost:8000"

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth(); // Get user data from auth context

  // Fetch cart products
  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token'); // Retrieve the token
      console.log('Retrieved token:', token); // Log the retrieved token

      if (!token) {
        setError("Authentication required");
        toast.error("Please sign in to view your cart");
        return;
      }

      const response = await axios.get(`${API_URL}/api/v1/user/cartProducts`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the headers
        },
      });

      console.log("Cart Products Response:", response); // Log the response

      if (response.data?.cart) {
        setProducts(response.data.cart);
      } else {
        setError("No products found");
        toast.error("No products found");
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch cart products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };
  
  useEffect(() => {
    if (user && token) {
      fetchCartProducts();
    }
  }, [user, token]);

  useEffect(() => {
    fetchCartProducts(); // Force fetching for testing
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/user/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
        toast.success('Product removed from cart');
      } else {
        toast.error(response.data.message || 'Failed to remove product');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting product';
      toast.error(errorMessage);
    }
  };


  const totalPrice = products.reduce((acc, product) => {
    const price = parseFloat(product.price) || 0;
    return acc + price;
  }, 0).toFixed(2);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
            <ShoppingCart className="w-20 h-20 text-amber-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Please Login to View Your Cart</h2>
            <p className="text-gray-600 mb-6">Sign in to access your shopping cart and continue shopping</p>
            <Link 
              to="/signin" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-amber-600 transition-all transform hover:scale-105"
            >
              Go to Signin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link 
            to="/products" 
            className="flex items-center text-gray-600 hover:text-primary transition-all transform hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <div className="w-[100px]" /> {/* Spacer for alignment */}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent absolute top-0 left-0 opacity-40"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <div className="text-red-600 mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Cart</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-12 h-12 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
                  <Link 
                    to="/products" 
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-amber-600 transition-all transform hover:scale-105"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product) => (
                    <CartProductCard
                      key={product._id}
                      product={product}
                      onDelete={() => deleteProduct(product._id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {products.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {products.map((product) => (
                      <div key={product._id} className="flex justify-between text-sm">
                        <p className="truncate max-w-[200px] text-gray-600">{product.title}</p>
                        <p className="font-medium text-gray-800">₹{parseFloat(product.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Subtotal ({products.length} items)</p>
                      <p className="font-medium text-gray-800">₹{totalPrice}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Shipping</p>
                      <p className="text-green-600 font-medium">Free</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                      <p>Total</p>
                      <p>₹{totalPrice}</p>
                    </div>
                    
                    <button 
                      onClick={() => toast.success('Checkout functionality coming soon!')}
                      className="w-full bg-primary hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg"
                    >
                      Proceed to Checkout
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
