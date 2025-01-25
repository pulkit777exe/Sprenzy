import { useState, useEffect } from 'react';
import ProductForm from './Products/ProductForm';
import ProductList from './Products/ProductList';
import { ShoppingBag } from 'lucide-react';
import axios from 'axios';

export default function CreateProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/user/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [products]); 

  const handleAddProduct = async (product) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/products`, product);
      setProducts([...products, response.data]);
      console.log(response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (index) => {
    try {
      const productToDelete = products[index];
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productToDelete.id}`);
      setProducts(products.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (index, updatedProduct) => {
    try {
      const productToUpdate = products[index];
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productToUpdate.id}`, updatedProduct);
      const updatedProducts = [...products];
      updatedProducts[index] = response.data;
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex justify-around items-center">
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
            <ProductList 
              products={products} 
              onDelete={handleDeleteProduct} 
              onUpdate={handleUpdateProduct} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
