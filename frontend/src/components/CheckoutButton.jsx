import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingBag } from 'lucide-react';

export const CheckoutButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
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
        <div className="flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </div>
      )}
    </button>
  );
}; 