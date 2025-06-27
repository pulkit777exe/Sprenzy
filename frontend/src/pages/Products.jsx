import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductGrid } from '../components/ProductGrid';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);
    
    const categories = [
        'All Categories',
        'Electronics',
        'Clothing',
        'Books',
        'Home & Kitchen',
        'Beauty',
        'Sports',
        'Toys'
    ];
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/product/all-products`
                );
                
                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError('Failed to load products');
                    toast.error('Failed to load products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error loading products');
                toast.error('Error loading products');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleCategoryChange = (category) => {
        setSelectedCategory(category === 'All Categories' ? '' : category);
    };
    
    const handlePriceChange = (e, index) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(e.target.value);
        setPriceRange(newRange);
    };
    
    const filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        // Price filter
        const price = parseFloat(product.price);
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mt-16 mb-2">All Products</h1>
                    <p className="text-gray-600">Discover our wide range of high-quality products</p>
                </div>
                
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                        </div>
                        
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
                            
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <div key={category} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={category}
                                                name="category"
                                                checked={selectedCategory === (category === 'All Categories' ? '' : category)}
                                                onChange={() => handleCategoryChange(category)}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor={category} className="ml-2 text-sm text-gray-600">
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                                        <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="min-price" className="text-xs text-gray-500">Min Price</label>
                                            <input
                                                type="number"
                                                id="min-price"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(e, 0)}
                                                min="0"
                                                max={priceRange[1]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="max-price" className="text-xs text-gray-500">Max Price</label>
                                            <input
                                                type="number"
                                                id="max-price"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(e, 1)}
                                                min={priceRange[0]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-3">
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-gray-600">
                                Showing <span className="font-medium">{filteredProducts.length}</span> products
                            </p>
                            
                            <div className="flex items-center">
                                <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
                                <select
                                    id="sort"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="popular">Popularity</option>
                                </select>
                            </div>
                        </div>
                        
                        <ProductGrid 
                            products={filteredProducts} 
                            loading={loading} 
                            error={error} 
                        />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}