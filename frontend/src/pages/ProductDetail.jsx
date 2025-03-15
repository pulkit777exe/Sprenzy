import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  ShoppingCart, Heart, Star, ChevronRight, ChevronLeft, 
  Truck, Shield, RotateCcw, Check, Info, ArrowLeft 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ProductGrid } from '../components/ProductGrid';
import { LazyImage } from '../components/LazyImage';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const imageRefs = useRef([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/product/${productId}`
        );
        
        if (response.data.success) {
          const productData = response.data.product;
          
          // Create images array from main image and additional images
          if (productData.imageUrl) {
            const allImages = [productData.imageUrl];
            
            if (productData.additionalImages && productData.additionalImages.length > 0) {
              allImages.push(...productData.additionalImages);
            } else {
              // Fallback placeholder images if no additional images
              allImages.push(
                'https://archive.org/download/placeholder-image/placeholder-image.jpg',
                'https://archive.org/download/placeholder-image/placeholder-image.jpg',
                'https://archive.org/download/placeholder-image/placeholder-image.jpg'
              );
            }
            
            productData.images = allImages;
          }
          
          setProduct(productData);
        } else {
          toast.error('Failed to load product details');
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error loading product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingFeatured(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/product/featuredProducts`
        );
        
        if (response.data.success) {
          // Filter out the current product from featured products
          const filteredProducts = response.data.products.filter(
            p => p._id !== productId
          ).slice(0, 4); // Limit to 4 products
          
          setFeaturedProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    
    if (productId) {
      fetchProduct();
      fetchFeaturedProducts();
    }
  }, [productId, navigate]);
  
  const handleAddToCart = async () => {
    try {
      if (!user) {
        toast.error('Please sign in to add items to your cart');
        navigate('/signin');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/addProduct/${product._id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        navigate('/signin');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add product to cart');
      }
    }
  };
  
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    
    // Scroll the thumbnail into view
    if (imageRefs.current[index]) {
      imageRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images.length - 1) : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product not found</h2>
            <p className="text-gray-500 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      ref={el => imageRefs.current[index] = el}
                      className={`
                        cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 w-20 h-20
                        ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}
                      `}
                      onClick={() => handleImageClick(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
                
                <div className="text-3xl font-bold text-primary mb-6">₹{product.price} /-</div>
                
                <div className="mb-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>In stock</span>
                    <span className="mx-2">•</span>
                    <span>Ships within 2-3 days</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-md w-32">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center border-0 focus:ring-0"
                    />
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    className="flex-1 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    {product.amazonUrl && (
                  <div>
                    <a 
                      href={product.amazonUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      View on Amazon
                      <ChevronRight className="w-6 h-6 ml-1" />
                    </a>
                  </div>
                )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                    <Truck className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm text-gray-600 text-center">Free Delivery</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm text-gray-600 text-center">Quality Guarantee</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                    <RotateCcw className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm text-gray-600 text-center">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  className={`pb-4 font-medium text-sm ${
                    activeTab === 'description' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                
                <button
                  className={`pb-4 font-medium text-sm ${
                    activeTab === 'specifications' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
              </div>
            </div>
            
            <div>
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start mt-6">
                    <Info className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Product Information</h4>
                      <p className="text-sm text-amber-700">
                        This product is sourced directly from trusted suppliers to ensure the highest quality.
                        Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500">Brand</td>
                            <td className="py-3 text-gray-800 font-medium">{product.brand}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500">Category</td>
                            <td className="py-3 text-gray-800 font-medium">{product.category}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500">Stock</td>
                            <td className="py-3 text-gray-800 font-medium">{product.stock} units</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <table className="w-full text-sm">
                        <tbody>
                          {product.specifications && product.specifications.length > 0 ? (
                            product.specifications.map((spec, index) => (
                              <tr key={index} className="border-b border-gray-200">
                                <td className="py-3 text-gray-500">{spec.name}</td>
                                <td className="py-3 text-gray-800 font-medium">{spec.value}</td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-b border-gray-200">
                              <td colSpan="2" className="py-3 text-gray-500 text-center">No specifications available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 