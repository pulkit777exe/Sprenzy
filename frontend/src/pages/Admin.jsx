import React, { useState } from 'react';
import ProductForm from '../components/Products/ProductForm';
import ProductList from '../components/Products/ProductList';
import { ShoppingBag } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Product Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              {products.length} Products
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Product</h2>
              <ProductForm onSubmit={handleAddProduct} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Product List</h2>
            <ProductList products={products} onDelete={handleDeleteProduct} />
          </div>
        </div>
      </main>
    </div>
  );
}
