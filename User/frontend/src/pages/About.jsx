import { Store } from "lucide-react";
import { Navbar } from "../components/Navbar";

export default function AboutPage() {       
    return (
        <>
            <Navbar />
            <div className="w-screen min-h-screen bg-amber-50 flex flex-col justify-center">
               <div className="mx-auto w-1/2 bg-white p-8 rounded-full shadow-lg">
                    <div className="flex items-center justify-center space-x-4">
                        <Store className="w-10 h-10"/>
                        <h1 className="text-4xl font-bold text-center">About Us</h1>
                    </div>
               </div>
               <div className="mx-auto w-1/2 bg-white p-8 rounded-full shadow-lg mt-8">
                    <div className="">
                        <p>Description</p>
                    </div>
               </div>
            </div>
        </>
    )
}