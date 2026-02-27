import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@config/apiConfig';

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

const CACHE_KEY = 'currentLocation';
const CACHE_METADATA_KEY = 'locationMetadata';
const RECENT_LOCATIONS_KEY = 'recentlyAddList';

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [recentlyAdds, setRecentlyAdds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationMetadata, setLocationMetadata] = useState({
    timestamp: null,
    source: 'cached',
    accuracy: null,
  });
  
  const initRef = useRef(false);

  // Get Google Maps API key
  const getGoogleApiKey = useCallback(() => {
    return API_CONFIG?.GOOGLE_MAPS_API_KEY || '';
  }, []);

  // Search places using Google Places Autocomplete
  const searchPlaces = useCallback(async (query) => {
    const apiKey = getGoogleApiKey();
    
    if (!apiKey) {
      console.warn('[Location] Google Maps API key not configured');
      return [];
    }

    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:in&types=geocode`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions) {
        return data.predictions.map(p => ({
          placeId: p.place_id,
          description: p.description,
          mainText: p.structured_formatting?.main_text || '',
          secondaryText: p.structured_formatting?.secondary_text || '',
        }));
      }
      
      return [];
    } catch (error) {
      console.error('[Location] Places search error:', error);
      return [];
    }
  }, [getGoogleApiKey]);

  // Get place details by place_id
  const getPlaceDetails = useCallback(async (placeId) => {
    const apiKey = getGoogleApiKey();
    
    if (!apiKey || !placeId) {
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry,formatted_address,address_components,name`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        const result = data.result;
        const components = result.address_components || [];
        
        // Extract address components
        const getComponent = (type) => {
          const comp = components.find(c => c.types.includes(type));
          return comp?.long_name || '';
        };

        return {
          city: getComponent('locality') || getComponent('administrative_area_level_2') || '',
          area: getComponent('sublocality_level_1') || getComponent('sublocality') || '',
          street: getComponent('route') || '',
          houseNumber: getComponent('street_number') || '',
          state: getComponent('administrative_area_level_1') || '',
          country: getComponent('country') || '',
          lat: result.geometry?.location?.lat?.toString() || '',
          lon: result.geometry?.location?.lng?.toString() || '',
          fullAddress: result.formatted_address || result.name || '',
        };
      }
      
      return null;
    } catch (error) {
      console.error('[Location] Place details error:', error);
      return null;
    }
  }, [getGoogleApiKey]);

  // Select a place from search results
  const selectPlace = useCallback(async (place) => {
    if (!place?.placeId) {
      return null;
    }

    setIsLoading(true);
    
    try {
      const details = await getPlaceDetails(place.placeId);
      
      if (details) {
        await updateLocation(details, 'manual');
        
        if (__DEV__) {
          console.log('[Location] Selected:', details.fullAddress);
        }
        
        return details;
      }
      
      return null;
    } catch (error) {
      console.error('[Location] Select place error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getPlaceDetails]);

  // Reverse geocode coordinates to address
  const resolveCoordinatesToLocation = useCallback(async (latitude, longitude) => {
    const fallbackLabel = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (results?.length) {
        const addr = results[0];
        const parts = [addr.name, addr.street, addr.city, addr.region, addr.country].filter(Boolean);
        
        return {
          city: addr.city || addr.subregion || addr.district || '',
          area: addr.district || addr.subregion || '',
          street: addr.street || '',
          houseNumber: addr.name || '',
          state: addr.region || '',
          country: addr.country || '',
          lat: latitude.toString(),
          lon: longitude.toString(),
          fullAddress: parts.join(', ') || fallbackLabel,
        };
      }
    } catch (error) {
      // Geocoding failed
    }

    return {
      ...EMPTY_LOCATION,
      lat: latitude.toString(),
      lon: longitude.toString(),
      fullAddress: fallbackLabel,
      city: 'Current Location',
    };
  }, []);

  // Save location to cache
  const saveToCache = useCallback(async (loc, source = 'gps') => {
    const metadata = {
      timestamp: Date.now(),
      source,
      accuracy: loc.accuracy || null,
    };
    
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(loc));
      await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('[Location] Cache save failed:', error);
    }
    
    return metadata;
  }, []);

  // Update location state and cache
  const updateLocation = useCallback(async (newLocation, source = 'manual') => {
    setLocation(newLocation);
    const metadata = await saveToCache(newLocation, source);
    setLocationMetadata(metadata);
    
    // Add to recent locations
    if (newLocation.fullAddress) {
      try {
        const existing = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
        let recent = existing ? JSON.parse(existing) : [];
        recent = recent.filter(r => r.fullAddress !== newLocation.fullAddress);
        recent.unshift(newLocation);
        if (recent.length > 5) recent = recent.slice(0, 5);
        await AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recent));
        setRecentlyAdds(recent);
      } catch (e) {
        // Ignore recent locations error
      }
    }
    
    if (__DEV__) {
      console.log('[Location] Updated:', source);
    }
  }, [saveToCache]);

  // Get current GPS location
  const getDeviceLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('[Location] Permission denied');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000,
      });
      
      return position.coords;
    } catch (error) {
      console.error('[Location] GPS failed:', error.message);
      return null;
    }
  }, []);

  // Refresh location from GPS
  const refreshLocation = useCallback(async (force = false) => {
    if (__DEV__) {
      console.log('[Location] Refresh requested');
    }
    
    setIsLoading(true);
    
    try {
      const coords = await getDeviceLocation();
      
      if (coords) {
        const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
        await updateLocation({ ...locationData, accuracy: coords.accuracy }, 'gps');
        return locationData;
      }
      return location;
    } catch (error) {
      console.error('[Location] Refresh error:', error);
      return location;
    } finally {
      setIsLoading(false);
    }
  }, [getDeviceLocation, resolveCoordinatesToLocation, updateLocation, location]);

  // Get age of current location in minutes
  const getLocationAge = useCallback(() => {
    if (!locationMetadata.timestamp) return Infinity;
    return (Date.now() - locationMetadata.timestamp) / 60000;
  }, [locationMetadata.timestamp]);

  // Reset to GPS mode
  const resetToGPS = useCallback(async () => {
    if (__DEV__) {
      console.log('[Location] Resetting to GPS');
    }
    return refreshLocation(true);
  }, [refreshLocation]);

  // Initialize on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      try {
        // Load recent locations
        const storedRecent = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
        if (storedRecent) {
          const parsed = JSON.parse(storedRecent);
          if (Array.isArray(parsed)) setRecentlyAdds(parsed);
        }

        // Load cached location
        const cachedLocation = await AsyncStorage.getItem(CACHE_KEY);
        const cachedMetadata = await AsyncStorage.getItem(CACHE_METADATA_KEY);

        if (cachedLocation) {
          const loc = JSON.parse(cachedLocation);
          const meta = cachedMetadata ? JSON.parse(cachedMetadata) : {
            timestamp: Date.now(),
            source: 'cached',
          };

          setLocation(loc);
          setLocationMetadata(meta);
          setIsLoading(false);

          if (__DEV__) {
            console.log('[Location] Loaded from cache');
          }
          
          setTimeout(() => refreshLocation(false), 500);
          return;
        }

        // No cache - get fresh location
        const coords = await getDeviceLocation();
        if (coords) {
          const locationData = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);
          await updateLocation({ ...locationData, accuracy: coords.accuracy }, 'gps');
        } else {
          setLocation(EMPTY_LOCATION);
        }
      } catch (error) {
        console.error('[Location] Init error:', error);
        setLocation(EMPTY_LOCATION);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

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
      resetToGPS,
      // Google Places
      searchPlaces,
      getPlaceDetails,
      selectPlace,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);