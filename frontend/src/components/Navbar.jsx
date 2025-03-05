import { Menu, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import axios from 'axios';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ["Home", "Products", "About", "Contact"];
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/user/cartProducts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCartItems(Array.isArray(response.data.cart) ? response.data.cart.length : 0);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems(0);
      }
    };

    if (user) {
      fetchCartItems();
    } else {
      setCartItems(0);
    }
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              Spenzy
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link 
              to="/cart" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems}
              </span>
            </Link>

            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t transition ease duration-500 border-gray-100">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary hover:bg-gray-100 p-2 rounded transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {!user && (
                <div className="flex flex-col space-y-2 px-4 pt-2 border-t border-gray-100">
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100  border-primary border  transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
