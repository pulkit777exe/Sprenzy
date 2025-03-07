import { useNavigate, useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason') || 'transaction_failed';
  const navigate = useNavigate();
  
  const getErrorMessage = () => {
    switch (reason) {
      case 'checksum_failed':
        return 'Payment verification failed. Please try again.';
      case 'server_error':
        return 'An error occurred while processing your payment.';
      default:
        return 'Your payment was not successful. Please try again.';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h1>
          
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Return to Cart
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}