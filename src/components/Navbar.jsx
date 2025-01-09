import { Menu, ShoppingCart } from "lucide-react";

export const Navbar = () => {
  const navItems = ["Home", "Products", "About", "Contact"];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold text-primary">
              Royal Choice
            </a>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="relative bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path d="M10 2a8 8 0 11-8 8 8 8 0 018-8zm0 2a6 6 0 106 6 6 6 0 00-6-6zm0 10a4 4 0 110 8 4 4 0 010-8z" />
              </svg>
              <span class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>

            <button class="md:hidden bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div class="md:hidden mt-8">
              <div class="flex flex-col space-y-4">
                <a href="/home" class="text-secondary hover:text-primary transition-colors">Home</a>
                <a href="/about" class="text-secondary hover:text-primary transition-colors">About</a>
                <a href="/contact" class="text-secondary hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};