import { useState } from 'react';
import PropTypes from 'prop-types';
import { Save, X } from 'lucide-react';

const initialFormData = {
  title: '',
  description: '',
  brand: '',
  price: 0,
  category: '',
  imageUrl: '',
  amazonUrl: '',
  stock: 0
};

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Toys',
  'Other',
];

export default function ProductForm({ onSubmit, initialValues = {} }) {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    brand: initialValues.brand || '',
    price: initialValues.price || 0,
    category: initialValues.category || '',
    imageUrl: initialValues.imageUrl || '',
    amazonUrl: initialValues.amazonUrl || '',
    stock: initialValues.stock || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass the form data to the parent's handler
    onSubmit(formData);
    // Clear the form if it's not for editing
    if (!initialValues.id) {
      setFormData(initialFormData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const validateProduct = (product) => {
    if (!product.title || !product.description || !product.price || !product.imageUrl || !product.category) {
      return "Please fill in all required fields";
    }
    
    if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
      return "Please enter a valid price";
    }
    
    if (isNaN(parseInt(product.stock)) || parseInt(product.stock) < 0) {
      return "Please enter a valid stock quantity";
    }
    
    return null; // No errors
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="5"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="amazonUrl" className="block text-sm font-medium text-gray-700">
            Amazon URL
          </label>
          <input
            type="url"
            id="amazonUrl"
            name="amazonUrl"
            value={formData.amazonUrl}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setFormData(initialFormData)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Product
        </button>
      </div>
    </form>
  );
}

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};
