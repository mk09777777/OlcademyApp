import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationContext = createContext();

const EMPTY_LOCATION = {
  city: '',
  area: '',
  street: '',
  houseNumber: '',
  state: '',
  country: '',
  lat: '',
  lon: '',
  fullAddress: '',
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [recentlyAdds, setRecentlyAdds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateLocation = useCallback(async (newLocation) => {
    setLocation(newLocation);
    try {
      await AsyncStorage.setItem('currentLocation', JSON.stringify(newLocation));
    } catch (error) {
      console.error('Error saving location to storage:', error);
      // Continue without storage - don't break the app
    }
  }, []);

  const resolveCoordinatesToLocation = useCallback(async (latitude, longitude) => {
    const fallbackLabel = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;

    try {
      const deviceAddress = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (deviceAddress?.length) {
        const [{
          city,
          region,
          subregion,
          district,
          street,
          name,
          country,
        }] = deviceAddress;

        const addressParts = [name, street, city, region, country].filter(Boolean);
        const fullAddress = addressParts.join(', ') || fallbackLabel;

        return {
          city: city || subregion || district || '',
          area: district || subregion || '',
          street: street || '',
          houseNumber: name || '',
          state: region || '',
          country: country || '',
          lat: latitude.toString(),
          lon: longitude.toString(),
          fullAddress,
        };
      }
    } catch (error) {
      console.error('Device reverse geocoding failed:', error);
      // Return fallback location with coordinates
    }

    return {
      ...EMPTY_LOCATION,
      lat: latitude.toString(),
      lon: longitude.toString(),
      fullAddress: fallbackLabel,
    };
  }, []);

  const getDeviceLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return null;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});
      return currentPosition.coords;
    } catch (error) {
      console.error('Error getting device location:', error);
      // Return null to trigger fallback behavior
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);

        let parsedRecent = [];
        try {
          const storedRecent = await AsyncStorage.getItem('recentlyAddList');
          if (storedRecent) {
            const recentList = JSON.parse(storedRecent);
            if (Array.isArray(recentList)) {
              parsedRecent = recentList;
              setRecentlyAdds(recentList);
            }
          }
        } catch (recentError) {
          console.error('Error loading recent locations:', recentError);
          // Continue with empty recent list
        }
        
        // Try to load saved location from storage first
        const savedLocation = await AsyncStorage.getItem('currentLocation');
        if (savedLocation) {
          setLocation(JSON.parse(savedLocation));
          return;
        }

        if (parsedRecent.length > 0) {
          await updateLocation(parsedRecent[0]);
          return;
        }

        const coords = await getDeviceLocation();
        if (coords) {
          const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
          await updateLocation(locationData);
          return;
        }

        setLocation(EMPTY_LOCATION);
      } catch (error) {
        console.error('Error initializing location:', error);
        setLocation(EMPTY_LOCATION);
        // App continues with empty location
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [getDeviceLocation, resolveCoordinatesToLocation, updateLocation]);

  return (
    <LocationContext.Provider value={{ location, setLocation, updateLocation, recentlyAdds, setRecentlyAdds, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);