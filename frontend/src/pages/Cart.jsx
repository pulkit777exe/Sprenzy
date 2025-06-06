import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartProductCard } from '../components/CartProductCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { ShoppingBag } from 'lucide-react';

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);

  const isDeleting = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/cartProducts');
        
        if (response.data.success) {
          const cartItems = response.data.products || [];
          setProducts(cartItems);
          calculateTotals(cartItems);
        } else {
          toast.error(response.data.message || 'Failed to fetch cart products');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        } else {
          toast.error('Error fetching cart items');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [user, navigate]);

  const handleDeleteProduct = async (productId) => {
    try {
      // Prevent duplicate toasts by checking if already deleting
      if (isDeleting.current) return;
      isDeleting.current = true;
      
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
      
      const newSubtotal = updatedProducts.reduce((total, product) => 
        total + (parseFloat(product.price || 0) * (product.quantity || 1)), 0);
      
      setSubtotal(newSubtotal);
      setShipping(newSubtotal > 1000 ? 0 : 100);
      setTax(newSubtotal * 0.18);
      
      toast.success('Product removed from cart');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to remove product from cart');
    } finally {
      isDeleting.current = false;
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const productIndex = products.findIndex(p => p._id === productId);
      if (productIndex === -1) return;
      
      const updatedProducts = [...products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        quantity: newQuantity
      };
      
      setProducts(updatedProducts);
      
      const newSubtotal = updatedProducts.reduce((total, product) => 
        total + (parseFloat(product.price || 0) * (product.quantity || 1)), 0);
      
      setSubtotal(newSubtotal);
      setShipping(newSubtotal > 1000 ? 0 : 100);
      setTax(newSubtotal * 0.18);
    } catch (error) {
      console.error('Error updating product quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const calculateTotal = () => {
    return (subtotal + shipping + tax).toFixed(2);
  };

  const calculateTotals = (cartItems) => {
    // Calculate subtotal based on product structure
    const newSubtotal = cartItems.reduce((total, product) => {
      const price = product.productDetails?.price || product.price || 0;
      const productQuantity = product.quantity || 1;
      return total + (parseFloat(price) * productQuantity);
    }, 0);
    
    console.log('Calculated subtotal:', newSubtotal);
    
    setSubtotal(newSubtotal);
    setShipping(newSubtotal > 500 ? 0 : 100);
    setTax(newSubtotal * 0.18);
  };

  const CheckoutButton = () => {
    const handleCheckout = () => {
      navigate('/checkout', { state: { products } });
    };
    
    return (
      <button
        onClick={handleCheckout}
        className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Proceed to Checkout
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent absolute top-0 left-0 opacity-40"></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you have not added any products to your cart yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {products.map(product => (
                  <CartProductCard
                    key={product._id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold mb-6">
                  <h4 className="text-gray-800">Total</h4>
                  <p className="text-2xl text-primary">₹{calculateTotal()}</p>
                </div>
                
                <CheckoutButton />
                
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">Free shipping on orders over ₹500</p>
                  <p>Estimated delivery: 5-7 business days</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span>Payment methods accepted:</span>
                    <div className="flex gap-2">
                      <span className="text-blue-600">UPI</span>
                      <span className="text-red-600">Mastercard</span>
                      <span className="text-indigo-600">Cash On Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
