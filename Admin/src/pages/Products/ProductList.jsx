import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';

export default function ProductList({ products, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-primary">
                {product.category}
              </span>
              <div className="flex space-x-2">
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-green-500"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  onClick={() => onDelete(index)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
