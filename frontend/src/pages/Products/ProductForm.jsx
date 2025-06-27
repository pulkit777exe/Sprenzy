import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Image, Save, ArrowLeft } from 'lucide-react';
import { LazyImage } from '../../components/LazyImage';

export default function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!productId;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    additionalImages: ['', '', ''],
    category: '',
    brand: 'Sprenzy',
    stock: 10,
    featured: false,
    amazonUrl: '',
    specifications: [{ name: '', value: '' }]
  });
  
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [productId]);
  
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(
        `/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const product = response.data.product;
        
        // Ensure additionalImages has at least 3 slots
        const additionalImages = product.additionalImages || [];
        while (additionalImages.length < 3) {
          additionalImages.push('');
        }
        
        // Ensure specifications has at least one item
        const specifications = product.specifications || [];
        if (specifications.length === 0) {
          specifications.push({ name: '', value: '' });
        }
        
        setFormData({
          ...product,
          additionalImages,
          specifications
        });
      } else {
        toast.error('Failed to load product data');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product data');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAdditionalImageChange = (index, value) => {
    const updatedImages = [...formData.additionalImages];
    updatedImages[index] = value;
    
    setFormData(prev => ({
      ...prev,
      additionalImages: updatedImages
    }));
  };
  
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, '']
    }));
  };
  
  const removeImageField = (index) => {
    const updatedImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      additionalImages: updatedImages
    }));
  };
  
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };
  
  const addSpecificationField = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '' }]
    }));
  };
  
  const removeSpecificationField = (index) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        specifications: formData.specifications.filter(spec => spec.name && spec.value)
      };

      let response;
      
      if (isEditMode) {
        response = await api.put(`/product/update-product/${productId}`, payload);
      } else {
        response = await api.post('/product/create-products', payload);
      }

      if (response.data.success) {
        toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        
      </div>
      
      <form className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter product title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Toys">Toys</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter brand name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter stock quantity"
              />
            </div>
            
            <div className="flex items-center h-full pt-6">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Enter product description"
            ></textarea>
          </div>
        </div>
        
        {/* Images Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary"
                placeholder="Enter main image URL"
              />
              {formData.imageUrl && (
                <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg flex items-center">
                  <Image className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
            
            {formData.imageUrl && (
              <div className="mt-3">
                <LazyImage 
                  src={formData.imageUrl} 
                  alt="Main product image" 
                  className="h-40 object-contain border border-gray-200 rounded-md p-1 bg-white"
                  fallbackSrc="https://via.placeholder.com/400x400?text=Invalid+URL"
                />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Image
              </button>
            </div>
            
            {formData.additionalImages.length > 0 ? (
              <div className="space-y-3">
                {formData.additionalImages.map((url, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-grow">
                      <div className="flex">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary"
                          placeholder={`Additional image URL ${index + 1}`}
                        />
                        {url && (
                          <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg flex items-center">
                            <Image className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      {url && (
                        <div className="mt-2">
                          <LazyImage 
                            src={url} 
                            alt={`Additional image ${index + 1}`} 
                            className="h-20 object-contain border border-gray-200 rounded-md p-1 bg-white"
                            fallbackSrc="https://via.placeholder.com/150?text=Invalid+URL"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No additional images added yet.</p>
            )}
            
            {formData.additionalImages.some(url => url) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.additionalImages.map((url, index) => (
                  url && (
                    <div key={index} className="relative w-16 h-16 border rounded-lg overflow-hidden bg-white">
                      <LazyImage
                        src={url}
                        alt={`Additional image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Specifications Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Specifications</h2>
            <button
              type="button"
              onClick={addSpecificationField}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Specification
            </button>
          </div>
          
          {formData.specifications.length > 0 ? (
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Specification name"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Specification value"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecificationField(index)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No specifications added yet.</p>
          )}
        </div>
        
        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amazon URL (Optional)
            </label>
            <input
              type="text"
              name="amazonUrl"
              value={formData.amazonUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Enter Amazon product URL"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isEditMode ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
} 