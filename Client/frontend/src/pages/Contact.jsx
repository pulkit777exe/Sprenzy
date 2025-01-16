import { Navbar } from "../components/Navbar";
import { Contact } from "lucide-react";
export default function ContactPage(){
    return (
        <>
            <Navbar />
            <div className="w-screen min-h-screen bg-amber-50 flex flex-col justify-center">
               <div className="mx-auto w-1/2 bg-white p-8 rounded-full shadow-lg">
                    <div className="flex items-center justify-center space-x-4">
                        <Contact className="w-10 h-10"/>
                        <h1 className="text-4xl font-bold text-center">Contact Info</h1>
                    </div>
               </div>
               <div className="mx-auto w-1/2 bg-white p-8 rounded-full shadow-lg mt-8">
                    <div className="">
                        <p>Contact Description</p>
                    </div>
               </div>
            </div>
        </>
    )
}