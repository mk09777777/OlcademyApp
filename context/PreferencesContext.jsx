import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    favoriteCuisines: [],
    dietaryPreferences: [],
    pricePreference: 'medium',
    deliveryTime: [],
    mealTypes: [],
    maxDistance: 10,
  });

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem('userPreferences');
        if (stored) {
          setPreferences(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Save preferences to storage whenever they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    };
    savePreferences();
  }, [preferences]);

  const updatePreferences = async (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}; 