import { Navbar } from "../components/Navbar";
import { ProductGrid } from "../components/ProductGrid";

export default function ProductsPage() {
    return (
        <>
        <Navbar />
            <div className="p-8">
                <ProductGrid />
            </div>
        </>
    )
}