import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`, {
        withCredentials: true
      });
      
      if (response.data?.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, 
        credentials,
        { withCredentials: true }
      );
      
      if (response.data?.success) {
        await fetchUserProfile();
        toast.success('Logged in successfully');
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };
  
  // Other auth methods (logout, register, etc.)
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, login, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 