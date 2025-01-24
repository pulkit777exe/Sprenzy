import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router"; 

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ["Home", "Products", "About", "Contact"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-screen bg-white shadow-sm z-10">
      <div className="container mx-auto px-4 py-4">
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
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative bg-transparent border-none">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 text-secondary hover:text-primary transition-colors" />
              </Link>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden bg-transparent border-none"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-8">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-secondary hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
