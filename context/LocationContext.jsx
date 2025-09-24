import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    city: '',
    area: '',
    street: '',
    houseNumber: '',
    state: '',
    country: '',
    lat: '',
    lon: '',
    fullAddress: '',
  });
  const [recentlyAdds, setRecentlyAdds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        
        // Try to load saved location from storage first
        const savedLocation = await AsyncStorage.getItem('currentLocation');
        if (savedLocation) {
          setLocation(JSON.parse(savedLocation));
          setIsLoading(false);
          return;
        }
        const coords = await getDeviceLocation();
        if (coords) {
          const locationData = await reverseGeocode(coords.latitude, coords.longitude);
          
          if (locationData) {
            setLocation(locationData);
            await AsyncStorage.setItem('currentLocation', JSON.stringify(locationData));
          } else {
            // Fallback to default location if reverse geocoding fails
            const defaultLocation = {
              city: 'New Delhi',
              state: 'Delhi',
              country: 'India',
              lat: '28.6139',
              lon: '77.2090',
              fullAddress: 'New Delhi, Delhi, India',
              area: '',
              street: '',
              houseNumber: '',
            };
            setLocation(defaultLocation);
            await AsyncStorage.setItem('currentLocation', JSON.stringify(defaultLocation));
          }
        } else {
          // Use default location if device location is not available
          const defaultLocation = {
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India',
            lat: '28.6139',
            lon: '77.2090',
            fullAddress: 'New Delhi, Delhi, India',
            area: '',
            street: '',
            houseNumber: '',
          };
          setLocation(defaultLocation);
          await AsyncStorage.setItem('currentLocation', JSON.stringify(defaultLocation));
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        
        // Final fallback
        const defaultLocation = {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          lat: '28.6139',
          lon: '77.2090',
          fullAddress: 'New Delhi, Delhi, India',
          area: '',
          street: '',
          houseNumber: '',
        };
        setLocation(defaultLocation);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Update location and save to storage
  const updateLocation = async (newLocation) => {
    setLocation(newLocation);
    try {
      await AsyncStorage.setItem('currentLocation', JSON.stringify(newLocation));
    } catch (error) {
      console.error('Error saving location to storage:', error);
    }
  };

  const getDeviceLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return null;
      }
      let location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error('Error getting device location:', error);
      return null;
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, recentlyAdds, setRecentlyAdds, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);