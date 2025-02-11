import React, { useState } from "react";
import { ShoppingBag, Mail, Lock, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function SignUp() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password || !username) {
                toast.error("Please fill in all fields");
                return;
            }

            await signup(username, email, password);
            toast.success("Successfully signed up! Please sign in.");
            navigate("/signin");
        } catch (error) {
            console.error('Signup error:', error);
            toast.error(error.response?.data?.message || "Failed to sign up");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        navigate("/signin");
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-orange-100 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <ShoppingBag className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign up and take a tour of our website.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserRound className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text"
                                        id="username"
                                        name="username"
                                        required
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your name..." />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="password"
                                        id="password"
                                        name="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="*******" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200 disabled:opacity-50"
                        >
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                        <div className="text-center text-sm">
                            <span className="text-secondary">Already have an account?</span>
                            {' '}
                            <a onClick={handleClick} className="font-medium hover:text-secondary text-primary">
                                Sign In
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}