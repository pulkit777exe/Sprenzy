import { useState } from 'react';

export const ProductCard = ({
  title,
  description,
  price,
  imageUrl,
  amazonUrl,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async ({ title, price, imageUrl }) => {
    setIsAdding(true); 

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/user/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, price, imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();

      if (data.success) {
        alert('Item added to cart!');
      } else {
        setError('Something went wrong!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white shadow-md overflow-hidden transition-transform hover:-translate-y-1 rounded-[12px] flex flex-col">
      <img src={imageUrl} alt={title} className="h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

        <div className="flex items-center justify-between mt-auto gap-2">
          <span className="text-primary font-bold">₹ {price.toFixed(2)}</span>
          <button
            onClick={() => window.open(amazonUrl, "_blank")}
            className="bg-black rounded-xl p-2 hover:bg-primary text-white transition-colors"
          >
            Buy on Amazon
          </button>
          <button
            onClick={() => addToCart({ title, price, imageUrl })}
            className="border border-primary rounded-xl p-2 hover:bg-primary hover:text-white transition-colors"
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
};
