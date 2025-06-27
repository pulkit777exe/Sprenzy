import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchOrderDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setOrderDetails(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId, fetchOrderDetails]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
          )}
          
          {orderDetails && (
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{orderDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/products')}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 