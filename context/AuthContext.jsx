import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';
import { log, warn, error as logError } from '../utils/logger';
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
          log('Checking stored auth state');
          
          try {
            const response = await api.get('/api/user');
            
            if (response.data?.user || response.data?.success) {
              setIsAuthenticated(true);
              setUser(parsedUser);
              
              // Try to get profile data, but don't fail auth if it fails
              try {
                const profileResponse = await api.get('/api/profile');
                setProfileData(profileResponse.data);
              } catch (profileError) {
                warn('Profile fetch failed:', profileError.message);
              }
            } else {
              throw new Error('User validation failed');
            }
          } catch (apiError) {
            log('API validation failed, clearing auth:', apiError.message);
            await AsyncStorage.removeItem('userData');
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/auth/LoginScreen'); 
          }
        } else {
          log('No stored user data, redirecting to login');
          setIsAuthenticated(false);
          router.replace('/auth/LoginScreen'); 
        }
      } catch (error) {
        logError('Auth check error:', error);
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
      log('Setting user data');
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      
      // Try to fetch profile data after login
      try {
        const profileResponse = await api.get('/api/profile');
        setProfileData(profileResponse.data);
      } catch (profileError) {
        warn('Profile fetch after login failed:', profileError.message);
      }
      
      router.replace('home');
    } catch (error) {
      logError('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/Logout');
    } catch (error) {
      if (error.response) {
        logError('Logout failed:', error.response.status);
      } else if (error.request) {
        logError('No server response during logout');
      } else {
        logError('Logout setup error:', error.message);
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
        logError('Storage cleanup error:', cleanupError);
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