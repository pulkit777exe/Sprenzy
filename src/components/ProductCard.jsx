export const ProductCard = ({
  title,
  description,
  price,
  image,
  amazonUrl,
}) => {
  return (
    <div className="bg-white shadow-md overflow-hidden transition-transform hover:-translate-y-1 rounded-[12px] flex flex-col">
      <img
        src={image}
        alt={title}
        className="h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-bold">₹ {price.toFixed(2)}</span>
          <button
            onClick={() => window.open(amazonUrl, "_blank")}
            className="bg-black rounded-full p-2 hover:bg-primary text-white transition-colors"
          >
            Buy on Amazon
          </button>
        </div>
      </div>
    </div>
  );
};
