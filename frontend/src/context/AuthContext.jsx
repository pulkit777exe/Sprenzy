import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Verifying token...');
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/user/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            console.log('Token verified successfully');
            setUser(response.data.user);
          } else {
            console.warn('Token verification failed:', response.data);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        console.error('Error details:', error.response?.data);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      console.log('API URL:', `${import.meta.env.VITE_BACKEND_API_URL}/user/signin`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/signin`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { user: response.data.user };
      }
      
      return { error: response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      return { 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };
  
  const googleLogin = async (credential) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/google-auth`,
        { credential }
      );
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { user: response.data.user };
      }
      
      return { error: response.data.message || 'Google login failed' };
    } catch (error) {
      console.error('Google login error:', error);
      return { error: error.response?.data?.message || 'Google login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/signup`,
        { username, email, password }
      );
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    token,
    signup,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
