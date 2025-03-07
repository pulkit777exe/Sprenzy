import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ArrowLeft, Loader } from 'lucide-react';

export default function PaytmCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    if (location.state?.products) {
      setProducts(location.state.products);
      calculateTotals(location.state.products);
      setLoading(false);
    } else {
      fetchCartProducts();
    }
  }, [user, navigate, location]);
  
  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/cartProducts`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const cartItems = response.data.products || [];
        setProducts(cartItems);
        calculateTotals(cartItems);
      } else {
        toast.error(response.data.message || 'Failed to fetch cart products');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Error fetching cart items');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateTotals = (cartItems) => {
    const newSubtotal = cartItems.reduce((total, product) => {
      const price = product.productDetails?.price || product.price || 0;
      const qty = product.quantity || 1;
      return total + (parseFloat(price) * qty);
    }, 0);
    
    setSubtotal(newSubtotal);
    setShipping(newSubtotal > 500 ? 0 : 100);
    setTax(newSubtotal * 0.18);
  };
  
  const calculateTotal = () => {
    return (subtotal + shipping + tax).toFixed(2);
  };
  
  const handlePaytmPayment = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/payment/paytm`,
        { 
          items: products,
          amount: calculateTotal(),
          userId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // For Paytm, we typically need to submit a form with the payment parameters
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else if (response.data.formHtml) {
          // Create a temporary form element and submit it
          const form = document.createElement('div');
          form.innerHTML = response.data.formHtml;
          document.body.appendChild(form);
          document.forms[0].submit();
        }
      } else {
        toast.error(response.data.message || 'Failed to initiate payment');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error(error.response?.data?.message || 'Payment initiation failed');
      setProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
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
            <p className="text-gray-500 mb-8">You need to add products to your cart before checkout.</p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  {products.map((product, index) => {
                    const {
                      title = product.productDetails?.title || product.title || '',
                      price = product.productDetails?.price || product.price || 0,
                      imageUrl = product.productDetails?.imageUrl || product.imageUrl || 'https://placehold.co/600x400',
                    } = product;
                    
                    return (
                      <div key={index} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <img 
                            src={imageUrl} 
                            alt={title} 
                            className="w-16 h-16 object-cover rounded-lg mr-4" 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400'; }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">{title}</h3>
                            <p className="text-gray-500 text-sm">Qty: {product.quantity || 1}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-800">₹{parseFloat(price).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="123 Main St"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
                
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
                
                <button
                  onClick={handlePaytmPayment}
                  disabled={processing}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with Paytm
                    </>
                  )}
                </button>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">Free shipping on orders over ₹500</p>
                  <p>Estimated delivery: 5-7 business days</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span>Payment methods:</span>
                    <div className="flex gap-2">
                      <span className="text-blue-600">Paytm</span>
                      <span className="text-red-600">UPI</span>
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