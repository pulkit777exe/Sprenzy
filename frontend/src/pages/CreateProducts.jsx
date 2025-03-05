import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ProductForm from './Products/ProductForm';
import ProductList from './Products/ProductList';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CreateProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!user.isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/product/all-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      // Validate stock
      if (productData.stock === undefined || productData.stock < 0) {
        toast.error('Please enter a valid stock quantity');
        return;
      }

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/product/create-products`,
        {
          ...productData,
          stock: parseInt(productData.stock) // Ensure stock is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Product created successfully');
        fetchProducts();
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (index, productData) => {
    try {
      // Validate stock
      if (productData.stock === undefined || productData.stock < 0) {
        toast.error('Please enter a valid stock quantity');
        return;
      }

      const token = localStorage.getItem('token');
      const productId = products[index]._id;
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/product/update-product/${productId}`,
        {
          ...productData,
          stock: parseInt(productData.stock) // Ensure stock is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Product updated successfully');
        fetchProducts();
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const productId = products[index]._id;
      
      // Confirm before deleting
      if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
      }
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_URL}/product/delete-product/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchProducts(); // Refresh the products list
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete products');
        navigate('/');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-primary mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Home</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <ShoppingBag className="h-8 w-8 mr-3 text-primary" />
                Admin Panel - Manage Products
              </h1>
            </div>
            <div className="bg-amber-100 px-4 py-2 rounded-lg">
              <p className="text-amber-800 font-medium">Admin Mode</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>
                <ProductForm onSubmit={handleCreateProduct} />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Product List</h2>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent absolute top-0 left-0 opacity-40"></div>
                    </div>
                  </div>
                ) : (
                  <ProductList 
                    products={products} 
                    onDelete={handleDeleteProduct} 
                    onUpdate={handleUpdateProduct} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
