export const ProductCard = ({
  title,
  description,
  price,
  imageUrl,
  amazonUrl,
}) => {
  // const addToCart = async ({ title, price, imageUrl }) => {
  //   try{
  //     const response = await axios.post("/cart", { title, price, imageUrl });
  //     return response.data
  //   }

  // }
  return (
    <div className="bg-white shadow-md overflow-hidden transition-transform hover:-translate-y-1 rounded-[12px] flex flex-col">
      <img
        src={imageUrl}
        alt={title}
        className="h-48 object-cover"
      />
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
            className="border border-primary rounded-xl p-2 hover:bg-primary hover:text-white transition-colors">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
