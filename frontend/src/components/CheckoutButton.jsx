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
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/payment/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Create a form to submit to Paytm
        const form = document.createElement('form');
        form.method = 'post';
        form.action = response.data.txnUrl;

        // Add all Paytm parameters as hidden fields
        Object.entries(response.data.params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(response.data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response?.status === 503) {
        toast.error('Payment system is currently unavailable. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to process checkout');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isProcessing}
      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
          Processing...
        </div>
      ) : (
        'Proceed to Checkout'
      )}
    </button>
  );
}; 