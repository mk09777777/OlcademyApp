import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

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

// Freshness thresholds (in minutes)
const FRESHNESS_SKIP = 5;
const FRESHNESS_BACKGROUND = 30;
const DISTANCE_THRESHOLD = 75; // meters
const GPS_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [recentlyAdds, setRecentlyAdds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationMetadata, setLocationMetadata] = useState({
    timestamp: null,
    source: 'cached',
    accuracy: null,
  });

  const updateLocation = useCallback(async (newLocation, source = 'manual') => {
    const metadata = {
      timestamp: Date.now(),
      source,
      accuracy: newLocation.accuracy || null,
    };
    
    setLocation(newLocation);
    setLocationMetadata(metadata);
    
    try {
      await AsyncStorage.setItem('currentLocation', JSON.stringify(newLocation));
      await AsyncStorage.setItem('locationMetadata', JSON.stringify(metadata));
      
      if (__DEV__) {
        console.log('[Location] Updated:', source, '- Age: 0 mins');
      }
    } catch (error) {
      console.error('Error saving location to storage:', error);
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
      if (__DEV__) {
        console.log('[Location] Reverse geocoding failed (offline?), using coordinates');
      }
    }

    // Fallback: return coordinates with minimal info
    return {
      ...EMPTY_LOCATION,
      lat: latitude.toString(),
      lon: longitude.toString(),
      fullAddress: fallbackLabel,
      city: 'Unknown',
    };
  }, []);

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }, []);

  const getLocationAge = useCallback(() => {
    if (!locationMetadata.timestamp) return Infinity;
    return (Date.now() - locationMetadata.timestamp) / 60000; // minutes
  }, [locationMetadata.timestamp]);

  const shouldRefreshLocation = useCallback(() => {
    const age = getLocationAge();
    
    // Manual selection never auto-refreshes
    if (locationMetadata.source === 'manual') {
      if (__DEV__) {
        console.log('[Location] Manual selection - GPS disabled');
      }
      return { shouldRefresh: false, reason: 'manual' };
    }

    // No cached location
    if (!locationMetadata.timestamp) {
      return { shouldRefresh: true, reason: 'no-cache', priority: 'force' };
    }

    // Fresh location (< 5 min)
    if (age < FRESHNESS_SKIP) {
      if (__DEV__) {
        console.log(`[Location] Age: ${age.toFixed(1)} mins - SKIP refresh`);
      }
      return { shouldRefresh: false, reason: 'fresh' };
    }

    // Stale location (> 30 min)
    if (age > FRESHNESS_BACKGROUND) {
      if (__DEV__) {
        console.log(`[Location] Age: ${age.toFixed(1)} mins - FORCE refresh`);
      }
      return { shouldRefresh: true, reason: 'stale', priority: 'force' };
    }

    // Medium age (5-30 min)
    if (__DEV__) {
      console.log(`[Location] Age: ${age.toFixed(1)} mins - BACKGROUND refresh`);
    }
    return { shouldRefresh: true, reason: 'medium', priority: 'background' };
  }, [locationMetadata, getLocationAge]);

  const getDeviceLocation = useCallback(async (accuracyLevel = 'balanced', timeout = GPS_TIMEOUT) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return null;
      }

      const accuracy = accuracyLevel === 'low' 
        ? Location.Accuracy.Low 
        : Location.Accuracy.Balanced;

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('GPS_TIMEOUT')), timeout)
      );

      // Create GPS promise
      const gpsPromise = Location.getCurrentPositionAsync({ 
        accuracy,
        maximumAge: 5000,
      });

      try {
        // Race between GPS and timeout
        const currentPosition = await Promise.race([gpsPromise, timeoutPromise]);
        return currentPosition.coords;
      } catch (raceError) {
        if (__DEV__) {
          console.log('[Location] GPS timeout or failed, trying fallbacks...');
        }

        // Fallback 1: Try network-based location (lower accuracy, faster)
        try {
          const networkPosition = await Promise.race([
            Location.getCurrentPositionAsync({ 
              accuracy: Location.Accuracy.Low,
              maximumAge: 10000,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('NETWORK_TIMEOUT')), 5000))
          ]);
          
          if (__DEV__) {
            console.log('[Location] Network-based location successful');
          }
          return networkPosition.coords;
        } catch (networkError) {
          // Fallback 2: Last known location
          if (__DEV__) {
            console.log('[Location] Trying last known location...');
          }
          
          const lastKnown = await Location.getLastKnownPositionAsync();
          if (lastKnown?.coords) {
            if (__DEV__) {
              console.log('[Location] Using last known location');
            }
            return lastKnown.coords;
          }
          
          throw raceError;
        }
      }
    } catch (error) {
      console.error('Error getting device location:', error);
      return null;
    }
  }, []);

  const refreshLocation = useCallback(async (forceRefresh = false, retryCount = 0) => {
    if (__DEV__) {
      console.log('[Location] refreshLocation called, forceRefresh:', forceRefresh, 'retry:', retryCount);
    }
    
    try {
      // Check if refresh is needed
      if (!forceRefresh) {
        const { shouldRefresh, reason } = shouldRefreshLocation();
        if (!shouldRefresh) {
          if (__DEV__) {
            console.log('[Location] Refresh not needed, reason:', reason);
          }
          return location;
        }
      }

      const coords = await getDeviceLocation('balanced');
      if (!coords) {
        if (__DEV__) {
          console.log('[Location] GPS failed - using cached');
        }
        
        // Retry logic
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
          if (__DEV__) {
            console.log(`[Location] Retrying in ${delay}ms...`);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          return refreshLocation(forceRefresh, retryCount + 1);
        }
        
        return location;
      }

      if (__DEV__) {
        console.log('[Location] GPS coords received:', coords.latitude, coords.longitude);
      }

      // Distance gating: only update if moved >= 75m
      if (location.lat && location.lon && !forceRefresh) {
        const distance = calculateDistance(
          parseFloat(location.lat),
          parseFloat(location.lon),
          coords.latitude,
          coords.longitude
        );

        if (distance < DISTANCE_THRESHOLD) {
          if (__DEV__) {
            console.log(`[Location] Distance: ${distance.toFixed(0)}m - SKIP update`);
          }
          // Update timestamp but keep location
          setLocationMetadata(prev => ({ ...prev, timestamp: Date.now() }));
          return location;
        }

        if (__DEV__) {
          console.log(`[Location] Distance: ${distance.toFixed(0)}m - UPDATE`);
        }
      }

      const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
      await updateLocation({ ...locationData, accuracy: coords.accuracy }, 'gps');
      return locationData;
    } catch (error) {
      console.error('Error refreshing location:', error);
      
      // Retry on error
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        if (__DEV__) {
          console.log(`[Location] Error occurred, retrying in ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return refreshLocation(forceRefresh, retryCount + 1);
      }
      
      return location;
    }
  }, [location, shouldRefreshLocation, getDeviceLocation, calculateDistance, resolveCoordinatesToLocation, updateLocation]);

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
        }
        
        // Try to load saved location from storage first (cached-first approach)
        const savedLocation = await AsyncStorage.getItem('currentLocation');
        const savedMetadata = await AsyncStorage.getItem('locationMetadata');
        
        if (savedLocation) {
          const parsedLocation = JSON.parse(savedLocation);
          const parsedMetadata = savedMetadata ? JSON.parse(savedMetadata) : {
            timestamp: Date.now(),
            source: 'cached',
            accuracy: null,
          };
          
          setLocation(parsedLocation);
          setLocationMetadata(parsedMetadata);
          
          if (__DEV__) {
            const age = (Date.now() - parsedMetadata.timestamp) / 60000;
            console.log(`[Location] Loaded from cache (${age.toFixed(1)} mins old)`);
          }
          return;
        }

        if (parsedRecent.length > 0) {
          await updateLocation(parsedRecent[0]);
          return;
        }

        const coords = await getDeviceLocation('balanced');
        if (coords) {
          const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
          await updateLocation({ ...locationData, accuracy: coords.accuracy }, 'gps');
          return;
        }

        setLocation(EMPTY_LOCATION);
      } catch (error) {
        console.error('Error initializing location:', error);
        setLocation(EMPTY_LOCATION);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [getDeviceLocation, resolveCoordinatesToLocation, updateLocation]);

  // App foreground listener for background refresh
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        const age = locationMetadata.timestamp ? (Date.now() - locationMetadata.timestamp) / 60000 : Infinity;
        const isManual = locationMetadata.source === 'manual';
        
        // Only refresh if: not manual, age between 5-30 mins
        if (!isManual && age >= FRESHNESS_SKIP && age <= FRESHNESS_BACKGROUND) {
          if (__DEV__) {
            console.log(`[Location] App foregrounded - Age: ${age.toFixed(1)} mins - triggering background refresh`);
          }
          refreshLocation(false);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [locationMetadata.timestamp, locationMetadata.source, refreshLocation]);

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation, 
      updateLocation, 
      recentlyAdds, 
      setRecentlyAdds, 
      isLoading,
      refreshLocation,
      locationMetadata,
      getLocationAge,
      resetToGPS: useCallback(async () => {
        if (__DEV__) {
          console.log('[Location] Resetting to GPS mode');
        }
        try {
          const coords = await getDeviceLocation('balanced');
          if (coords) {
            const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
            await updateLocation({ ...locationData, accuracy: coords.accuracy }, 'gps');
            return locationData;
          }
          return null;
        } catch (error) {
          console.error('Error resetting to GPS:', error);
          return null;
        }
      }, [getDeviceLocation, resolveCoordinatesToLocation, updateLocation]),
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);