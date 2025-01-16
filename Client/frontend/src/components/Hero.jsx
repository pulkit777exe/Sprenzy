import { useNavigate } from "react-router";

export const Hero = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signup")
  }

  return (
    <div className="bg-accent py-28 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6">
              Discover Natural Goodness
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Explore our curated selection of premium healthy snacks and foods,
              sourced from nature's finest ingredients.
            </p>
            <button onClick={handleClick}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 text-lg rounded"
            >
              Shop Now
            </button>

          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1645869793265-832827adb63c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Featured Product"
              className="rounded-lg shadow-lg w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};