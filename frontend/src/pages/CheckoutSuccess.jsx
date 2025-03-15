import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
  const [isProcessing, setIsProcessing] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const completeCheckout = async () => {
      try {
        const token = localStorage.getItem('token');
        
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/payment/checkout-success`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        toast.success('Payment successful!');
      } catch (error) {
        console.error('Error completing checkout:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    completeCheckout();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been processed and will be shipped soon.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={() => navigate('/orders')}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 