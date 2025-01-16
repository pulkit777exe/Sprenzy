import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { ProductGrid } from "../components/ProductGrid";
import { Footer } from "../components/Footer";

export default function Home() {
    return <>
        <Navbar />
        <Hero />
        <ProductGrid />
        <Footer />        
    </>
}