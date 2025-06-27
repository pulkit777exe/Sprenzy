import { useState, useEffect } from 'react';
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { ProductGrid } from "../components/ProductGrid";
import { Footer } from "../components/Footer";
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = `${import.meta.env.VITE_BACKEND_API_URL}/product/featuredProducts`;
                console.log('Fetching products from:', url);
                
                let response = await axios.get(url);
                
                if (response.data.success && response.data.products.length > 0) {
                    setProducts(response.data.products);
                } else {
                    const allProductsUrl = `${import.meta.env.VITE_BACKEND_API_URL}/product/all-products`;
                    console.log('Fetching all products from:', allProductsUrl);
                    
                    response = await axios.get(allProductsUrl);
                    
                    if (response.data.success) {
                        setProducts(response.data.products.slice(0, 8));
                    } else {
                        setError("Failed to load products");
                        toast.error("Failed to load products");
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                console.error("Error details:", error.response);
                setError("Failed to load products");
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
            <Navbar />
            <Hero />
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
                    <p className="text-gray-600">Discover our selection of premium products</p>
                </div>
                <ProductGrid 
                    products={products} 
                    loading={loading} 
                    error={error}
                    showHeading={false}
                />
            </div>
            <Footer />        
        </div>
    );
}