import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <div className="error-container flex justify-center items-center min-h-screen bg-gray-100">
      <div className="error-card bg-white text-center p-10 rounded-lg shadow-lg max-w-md w-full">
        <div className="error-header text-7xl font-bold text-primary">404</div>
        <div className="error-title text-2xl mt-4 font-medium text-gray-800">Oops! Page Not Found</div>
        <div className="error-description text-lg mt-4 text-gray-600">
          We're sorry, but the page you were looking for doesn't exist. It might have been moved or deleted.
        </div>
        <Link to="/" className="btn-home mt-6 inline-block bg-primary hover:bg-primary/90 text-white text-lg py-3 px-8 rounded-full transition-all">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
