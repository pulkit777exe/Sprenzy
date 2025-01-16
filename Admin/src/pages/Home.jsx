import { useNavigate } from "react-router";

export default function Home(){
    const navigate = useNavigate();

    function navigateTo(onepage){
        navigate(onepage);
    }   
    return (
        <div className="min-h-screen w-screen">
            <div className="flex flex-col items-center justify-center">
                <div>
                    <h1 className="text-4xl font-bold mt-8">Welcome to Admin Panel</h1>   
                    <p className="mb-8 text-center">Click on button to go to the respective task</p> 
                </div>
                <button onClick={() => navigateTo("/user")} className="px-6 py-3 rounded-lg hover:bg-amber-100 border shadow-xl mb-4">Go To User Panel</button>
                <button onClick={() => navigateTo("/create-products")} className="px-6 py-3 rounded-lg hover:bg-amber-100 border shadow-xl ">Create Products</button>
            </div>
        </div>
    )
}