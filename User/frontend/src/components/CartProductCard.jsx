import { Trash2 } from "lucide-react";
import axios from "axios";

export const CartProductCard = ({
  product, 
  deleteProduct,
}) => {
  return (
    <div className="bg-white shadow-md overflow-hidden transition-transform rounded-[12px] flex">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-secondary mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-bold">₹ {product.price.toFixed(2)}</span>
          <Trash2
            onClick={() => deleteProduct(product._id)} 
            className="bg-black w-8 h-8 rounded-[10px] p-2 hover:bg-red text-white transition-colors cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
