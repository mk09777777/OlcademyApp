import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';
const api = axios.create({

  baseURL: API_CONFIG.BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState({});
  // AuthContext.jsx modifications
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const response = await api.get('/api/user');

          if (response.data?.user) {
            setIsAuthenticated(true);
            setUser(parsedUser);
            const profileResponse = await api.get('/api/profile');
            setProfileData(profileResponse.data);
          } else {
            await AsyncStorage.removeItem('userData');
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/auth/LoginScreen'); 
          }
        } else {
          router.replace('/auth/LoginScreen'); 
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        await AsyncStorage.removeItem('userData');
        router.replace('/auth/LoginScreen'); 
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      router.replace('home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/Logout');
    } catch (error) {
      if (error.response) {
        console.error('Logout failed:', error.response.status);
      } else if (error.request) {
        console.error('No server response during logout');
      } else {
        console.error('Logout setup error:', error.message);
      }
    } finally {
      // Always perform client-side cleanup
      try {
        await AsyncStorage.multiRemove(['authToken', 'userData']);
        setIsAuthenticated(false);
        setUser(null);
        setProfileData({});
        router.replace('/auth/LoginScreen');
      } catch (cleanupError) {
        console.error('Storage cleanup error:', cleanupError);
        router.replace('/auth/LoginScreen');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, profileData, setProfileData, api }}>
      {typeof children === 'function'
        ? children({ isAuthenticated, loading })
        : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);