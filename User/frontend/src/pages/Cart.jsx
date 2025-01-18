import { useState, useEffect } from "react";
import axios from "axios";
import { CartProductCard } from "../components/CartProductCard";

export default function Cart() {
    const [products, setProducts] = useState([]);

    async function checkout() {
        try {
            await axios.post(""); 
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    }

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get("http://localhost:3000/user/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="w-screen min-h-screen bg-amber-50">
            <h1 className="text-3xl text-center font-bold p-4">Cart Page</h1>
            <div className="mx-auto p-4 flex justify-around">
                <div className="flex flex-col gap-4">
                    {products.map((product) => (
                        <CartProductCard
                            key={product._id}
                            title={product.title}
                            description={product.description}
                            price={product.price}
                            imageUrl={product.imageUrl}
                            amazonUrl={product.amazonUrl}
                        />
                    ))}
                </div>

                {/* Checkout Section */}
                <div className="border border-gray-300 p-4 bg-white rounded-lg w-1/3">
                    <div className="text-center text-xl font-bold">
                        Total
                        <hr className="m-4" />
                        {products.map((product) => (
                            <div key={product._id}>
                                <p>{product.title}</p> - <p>₹{product.price}</p>
                            </div>
                        ))}
                    </div>
                    {products.length === 0 && (
                        <p className="text-center">Your cart is empty</p>
                    )}
                        <hr className="m-4"/>
                    <div className="text-right mt-4">
                        <div className="flex justify-between">
                            <div className="font-bold">
                                ₹{products.reduce((acc, product) => acc + product.price, 0)}
                            </div>
                            <div>
                                {products.length} items
                            </div>
                        </div>
                        <button className="bg-primary rounded-xl hover:bg-amber-500 text-white px-4 py-2" onClick={checkout}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
