import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';

export const CheckoutButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/signin');
        return;
      }
      
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/payment/create-checkout-session`,
          {
            successUrl: `${window.location.origin}/checkout-success`,
            cancelUrl: `${window.location.origin}/cart`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          // Redirect to Stripe checkout
          window.location.href = response.data.url;
        } else {
          toast.error('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        
        // For development - if Stripe is not configured, offer a mock payment option
        if (error.response?.status === 503 || error.message.includes('Network Error')) {
          const mockPayment = window.confirm(
            'Payment system is unavailable. Would you like to simulate a successful payment for testing?'
          );
          
          if (mockPayment) {
            navigate('/checkout-success');
          }
        } else {
          toast.error(error.response?.data?.message || 'Failed to process checkout');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={isProcessing}
      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
    </button>
  );
}; 