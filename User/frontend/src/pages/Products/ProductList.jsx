import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

export default function ProductList({ products, onDelete, onUpdate }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    brand: '',
    price: 0,
    category: '',
    imageUrl: '',
    amazonUrl: ''
  });

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditForm(products[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const handleEditSubmit = (index, e) => {
    e.preventDefault();
    onUpdate(index, editForm);
    setEditingIndex(null);
  };

  if (!products || products.length === 0) {
    return <div className="bg-white shadow rounded-lg p-6">No products available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product, index) => (
        <div key={product._id || index} className="bg-white shadow rounded-lg overflow-hidden">
          {editingIndex === index ? (
            <form onSubmit={(e) => handleEditSubmit(index, e)} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editForm.imageUrl}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amazon URL</label>
                <input
                  type="text"
                  name="amazonUrl"
                  value={editForm.amazonUrl}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-amber-600"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              {product.imageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-primary">
                    {product.category}
                  </span>
                  <div className="flex space-x-2">
                    {product.amazonUrl && (
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-amber-500"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button
                      onClick={() => handleEditClick(index)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}