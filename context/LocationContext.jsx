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
  const [isLoading, setIsLoading] = useState(true);
  const getDeviceLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return null;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      return coords;
    } catch (error) {
      console.error('Error getting device location:', error);
      return null;
    }
  };
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        return {
          city: location.city || '',
          state: location.region || '',
          country: location.country || '',
          lat: latitude.toString(),
          lon: longitude.toString(),
          fullAddress: `${location.name || ''} ${location.street || ''}, ${location.city || ''}, ${location.region || ''}, ${location.country || ''}`.trim(),
          area: location.district || '',
          street: location.street || '',
          houseNumber: location.name || '',
        };
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
    
    return null;
  };

  // Initialize location
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

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation: updateLocation, 
      recentlyAdds, 
      setRecentlyAdds,
      isLoading 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);