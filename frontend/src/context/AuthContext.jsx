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
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/user/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/signin`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { user: response.data.user };
      }
      
      return { error: response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        return { 
          error: 'Unable to connect to server. Please check if the server is running.' 
        };
      }
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
