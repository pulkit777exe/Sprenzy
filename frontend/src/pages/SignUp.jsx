import React, { useState } from "react";
import { ShoppingBag, Mail, Lock, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, googleLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password || !username) {
                toast.error("Please fill in all fields");
                setIsLoading(false);
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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            const result = await googleLogin(credentialResponse.credential);
            
            if (result.error) {
                toast.error(result.error);
            } else if (result.user) {
                toast.success(`Welcome, ${result.user.username || 'User'}!`);
                navigate("/");
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error("Failed to sign up with Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google sign up was unsuccessful. Please try again.");
    };

    const handleClick = () => {
        navigate("/signin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex justify-center items-center p-4">
            <div className="bg-amber-50 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary p-3 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create a new account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserRound className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="pill"
                            theme="outline"
                            text="signup_with"
                        />
                    </div>
                </div>
                
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={handleClick} className="font-medium text-primary hover:text-amber-600 transition-colors">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}