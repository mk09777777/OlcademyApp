import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from '@/components/BackRouting';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { API_CONFIG } from '@config/apiConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

/*
=== ORIGINAL CSS REFERENCE ===
  borderColor: '#e0e0e0',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

currentLocation: {
  backgroundColor: '#fffefeff',
  marginTop:10,
  marginHorizontal: 20,
  padding: 15,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  elevation: 2,
}

locationBoxContent: {
  flexDirection: 'row',
  alignItems: 'center',
}

locationTextContainer: {
  flex: 1,
  marginLeft: 10,
}

locationTitle: {
  fontFamily:'outfit-bold',
  fontSize: 16,
  color: '#000',
}

locationAddress: {
  fontSize: 14,
  color: '#666',
  marginTop: 2,
  fontFamily:'outfit-medium',
}

searchContainer: {
  position: 'relative',
  marginHorizontal: 20,
  marginTop: 10,
  marginBottom: 10,
}

searchInput: {
  backgroundColor: '#fff',
  padding: 12,
  paddingLeft: 40,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  fontSize: 16,
}

searchIcon: {
  position: 'absolute',
  left: 12,
  top: 12,
}

  top: 12,
}

suggestionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
}

suggestionText: {
  flex: 1,
  fontFamily:'outfit-medium',
  fontSize: 15,
  color: '#333',
}

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

loadingText: {
  marginTop: 10,
  fontFamily:'outfit-bold',
  fontSize: 16,
  color: '#666',
}

noResultsContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

noResultsText: {
  fontFamily:'outfit-bold',
  fontSize: 16,
  color: '#666',
}

initialStateContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

initialStateText: {
  marginTop: 10,
  fontSize: 16,
  fontFamily:'outfit-bold',
  color: '#999',
}
=== END CSS REFERENCE ===
*/

const resolveGoogleMapsApiKey = () => {
  const expoConfig = Constants.expoConfig ?? Constants?.manifest ?? Constants?.manifest2 ?? {};
  const extra = expoConfig?.extra ?? {};
  return (
    extra.googleMapsApiKey ??
    extra.GOOGLE_MAPS_API_KEY ??
    API_CONFIG?.GOOGLE_MAPS_API_KEY ??
    ''
  );
};

export default function MapPicker() {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  const { setLocation, setRecentlyAdds, location: currentLocation } = useLocationContext();
  const mapRef = useRef(null);
  const locationAlertVisibleRef = useRef(false);

  const googleMapsApiKey = resolveGoogleMapsApiKey();
  const isGoogleMapsConfigured = Boolean(googleMapsApiKey);
  const mapHeight = useMemo(() => {
    const windowHeight = Dimensions.get('window').height;
    return Math.min(Math.max(windowHeight * 0.45, 280), 420);
  }, []);

  const showLocationAlert = useCallback((title, message, buttons) => {
    if (locationAlertVisibleRef.current) {
      return;
    }

    locationAlertVisibleRef.current = true;

    const alertButtons = (buttons ?? [{ text: 'OK' }]).map((button) => ({
      ...button,
      onPress: () => {
        locationAlertVisibleRef.current = false;
        button.onPress?.();
      },
    }));

    Alert.alert(title, message, alertButtons, {
      cancelable: false,
      onDismiss: () => {
        locationAlertVisibleRef.current = false;
      },
    });
  }, []);

  useEffect(() => {
    if (!isGoogleMapsConfigured) {
      console.warn(
        'Google Maps API key is missing. Set GOOGLE_MAPS_API_KEY in your environment to enable MapPicker.'
      );
    }
  }, [isGoogleMapsConfigured]);

  const [region, setRegion] = useState({
    latitude: 19.1573,
    longitude: 73.2631,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // AddressMapPicker states
  const [address, setAddress] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // MapPicker states
  const [selectedType, setSelectedType] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // API config for address saving
  const API_BASE_URL = API_CONFIG.BACKEND_URL;

  const tagOptions = [
    { type: 'Home', icon: <Feather name="home" size={18} /> },
    { type: 'Work', icon: <MaterialCommunityIcons name="briefcase-outline" size={18} /> },
    { type: 'Hotel', icon: <MaterialCommunityIcons name="office-building" size={18} /> },
    { type: 'Other', icon: <FontAwesome5 name="map-marker-alt" size={16} /> },
  ];

  // Search for locations based on query
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ProjectZ/1.0.0 (mayurvicky01234@gmail.com)',
          },
        }
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching locations:', error);
      Alert.alert('Error', 'Could not search locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reverse geocode coordinates to get address
  const reverseGeocodeCoordinates = async (latitude, longitude) => {
    const fallbackLabel = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;

    const tryDeviceGeocode = async () => {
      try {
        const deviceAddress = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (deviceAddress?.length) {
          const [{ street, name, city, district, subregion, region, postalCode, country }] = deviceAddress;
          const manualAddress = [name || street, district, city, subregion, region, postalCode, country]
            .filter(Boolean)
            .join(', ');

          if (manualAddress) {
            setAddress(manualAddress);
            return manualAddress;
          }
        }
      } catch (deviceError) {
        console.error('Device reverse geocoding failed:', deviceError);
      }

      return null;
    };

    const deviceResult = await tryDeviceGeocode();
    if (deviceResult) {
      return deviceResult;
    }

    try {
      // Use Nominatim for consistency with AddressMapPicker
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ProjectZ/1.0.0 (mayurvicky01234@gmail.com)',
          },
        }
      );

      const addressData = response.data;
      const displayName = addressData.display_name || fallbackLabel;
      setAddress(displayName);
      return displayName;
    } catch (error) {
      console.error('Error reverse geocoding via Nominatim:', error);

      showLocationAlert(
        'Address lookup failed',
        'Unable to fetch your address automatically. You can continue by entering it manually.'
      );

      setAddress((prev) => prev || fallbackLabel);
      return fallbackLabel;
    }
  };

  // Handle selection of a search result
  const handleSelectSearchResult = async (result) => {
    try {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const newRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setSelectedCoordinate({ latitude: lat, longitude: lon });
      setCurrentAddress(result.display_name);
      setAddress(result.display_name);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }, 100);
      setShowSearchModal(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error selecting search result:', error);
      Alert.alert('Error', 'Could not select this location. Please try again.');
    }
  };

  // Get device current location
  const getCurrentLocation = async () => {
    try {
      setIsFetchingLocation(true);
      locationAlertVisibleRef.current = false;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showLocationAlert(
          'Permission Required',
          'Location permission is needed to use this feature. You can grant access from settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Linking.openSettings) {
                  Linking.openSettings();
                }
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      if (Platform.OS === 'android' && Location.enableNetworkProviderAsync) {
        try {
          await Location.enableNetworkProviderAsync();
        } catch (androidError) {
          console.warn('Unable to enable network provider automatically:', androidError);
        }
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        showLocationAlert(
          'Location services disabled',
          'Please turn on location services (GPS) and try again.'
        );
        return;
      }

      let coords = null;
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          mayShowUserSettingsDialog: true,
        });
        coords = position?.coords ?? null;
      } catch (positionError) {
        console.warn('High accuracy location fetch failed, trying last known position.', positionError);
        const lastKnown = await Location.getLastKnownPositionAsync();
        coords = lastKnown?.coords ?? null;
      }

      if (!coords) {
        throw new Error('Unable to determine current coordinates.');
      }

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setSelectedCoordinate({ latitude: coords.latitude, longitude: coords.longitude });
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }, 100);
      const addr = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setCurrentAddress(addr);
      setAddress(addr);
    } catch (error) {
      console.error('Error getting current location:', error);
      showLocationAlert('Location Error', 'Could not get current location. Please try again.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Handle map region change
  const handleRegionChangeComplete = async (newRegion) => {
    setRegion(newRegion);
    setSelectedCoordinate({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude
    });
    const addr = await reverseGeocodeCoordinates(newRegion.latitude, newRegion.longitude);
    setCurrentAddress(addr);
    setAddress(addr);
  };

  // Initialize with current location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        if (currentLocation && currentLocation.lat && currentLocation.lon) {
          const lat = parseFloat(currentLocation.lat);
          const lon = parseFloat(currentLocation.lon);
          const newRegion = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);
          setSelectedCoordinate({ latitude: lat, longitude: lon });
          if (currentLocation.fullAddress) {
            setCurrentAddress(currentLocation.fullAddress);
            setAddress(currentLocation.fullAddress);
          } else {
            const addr = await reverseGeocodeCoordinates(lat, lon);
            setCurrentAddress(addr);
            setAddress(addr);
          }
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
            }
          }, 500);
        } else {
          await getCurrentLocation();
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        setCurrentAddress('Tap to get current location');
        setAddress('');
      } finally {
        setIsLoading(false);
      }
    };
    initializeLocation();
  }, []);

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ProjectZ/1.0.0 (mayurvicky01234@gmail.com)',
          },
        }
      );

      const { city, town, village, suburb, county, state, country } = res.data.address;
      const selectedCity = city || town || village || suburb || county || 'Unknown';
      const fullAddress = res.data.display_name;

      const recentEntry = {
        city: selectedCity,
        state: state || '',
        country: country || '',
        fullAddress,
        lat: lat.toString(),
        lon: lon.toString(),
      };

      const existing = await AsyncStorage.getItem('recentlyAddList');
      let parsed = existing ? JSON.parse(existing) : [];
      parsed = parsed.filter(item => item.fullAddress !== recentEntry.fullAddress);
      parsed.unshift(recentEntry);
      if (parsed.length > 5) parsed = parsed.slice(0, 5);
      await AsyncStorage.setItem('recentlyAddList', JSON.stringify(parsed));
      setRecentlyAdds(parsed);

      return recentEntry;
    } catch (err) {
      console.log('Reverse geocoding failed:', err.message || err);

      // Fallback to device's reverse geocoding
      try {
        const address = await reverseGeocodeCoordinates(lat, lon);
        return {
          city: '',
          state: '',
          country: '',
          fullAddress: address,
          lat: lat.toString(),
          lon: lon.toString(),
        };
      } catch (error) {
        console.error('Fallback reverse geocoding also failed:', error);
        return null;
      }
    }
  };

  // Save address (AddressMapPicker logic)
  const handleSaveAddress = async () => {
    if (!address || !addressType) {
      Alert.alert('Error', 'Please provide an address and select a type.');
      return;
    }
    if (!selectedCoordinate) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }
    setIsSaving(true);
    try {
      const addressUpload = additionalDetails ? `${address}, ${additionalDetails}` : address;
      await axios.post(
        `${API_BASE_URL}/api/createUserAddress`,
        [
          {
            address: addressUpload,
            service_area: addressType,
            latitude: selectedCoordinate.latitude,
            longitude: selectedCoordinate.longitude,
          }
        ],
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      Alert.alert('Success', 'Address saved successfully');
      router.push('/screens/Address');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const getTagStyle = (type) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: addressType === type ? '#f23e3f' : '#ccc',
    backgroundColor: addressType === type ? '#ffe6e6' : '#fff',
  });

  const getTextStyle = (type) => ({
    marginLeft: 6,
    color: addressType === type ? '#f23e3f' : '#555',
  });

  if (!isGoogleMapsConfigured) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <BackRouting title='Add Address' />
        <View className="flex-1 items-center justify-center px-6">
          <Feather name="alert-triangle" size={40} color="#f23e3f" />
          <Text className="text-lg font-semibold text-gray-800 mt-5 text-center">
            Google Maps configuration needed
          </Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            Add a Google Maps API key to continue. Set the GOOGLE_MAPS_API_KEY environment
            variable and restart the app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#e41e3f" />
        <Text className="mt-2.5">Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting style={{ backgroundColor: '#f0f0f0' }} title='Add Address' />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Box */}
        <TouchableOpacity
          style={styles.searchTrigger}
          onPress={() => setShowSearchModal(true)}
          accessibilityRole="button"
        >
          <View style={styles.searchField} pointerEvents="none">
            <Feather name="search" size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              value={searchQuery}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <View
          style={[styles.mapWrapper, { height: mapHeight }]}
          accessible
          accessibilityHint="Interactive map to pick your address"
        >
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            onPress={(e) => {
              const { coordinate } = e.nativeEvent;
              setSelectedCoordinate(coordinate);
              reverseGeocodeCoordinates(coordinate.latitude, coordinate.longitude)
                .then(addr => {
                  setCurrentAddress(addr);
                  setAddress(addr);
                });
            }}
            showsUserLocation
            showsMyLocationButton={false}
            googleMapsApiKey={googleMapsApiKey}
          >
            {selectedCoordinate && (
              <Marker
                coordinate={selectedCoordinate}
                pinColor="#e41e3f"
                draggable
                onDragEnd={(e) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setSelectedCoordinate({ latitude, longitude });
                  reverseGeocodeCoordinates(latitude, longitude)
                    .then(addr => {
                      setCurrentAddress(addr);
                      setAddress(addr);
                    });
                }}
              />
            )}
          </MapView>

          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
            disabled={isFetchingLocation}
            accessibilityRole="button"
            accessibilityState={{ busy: isFetchingLocation }}
          >
            <View style={styles.currentLocationInner}>
              <MaterialIcons name="my-location" size={20} color="#e41e3f" />
              <Text style={styles.currentLocationText}>
                {isFetchingLocation ? 'Fetching your location...' : 'Use current location'}
              </Text>
              {isFetchingLocation && <ActivityIndicator size="small" color="#e41e3f" />}
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-white mt-4 mx-5 p-4 rounded-lg border border-gray-300 shadow-sm">
          <Text className="text-base font-medium text-gray-800 mb-3">Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3.5 mb-4 text-base bg-gray-50 min-h-[60px]"
            style={{ textAlignVertical: 'top' }}
            value={address}
            placeholder="Enter or select address"
            onChangeText={setAddress}
            multiline
          />
          <Text className="mb-2 text-textsecondary text-sm font-outfit">Additional address details*</Text>
          <Text className="mb-3 text-xs text-textsecondary font-outfit">E.g. Floor, House no.</Text>
          <TextInput
            placeholder="Enter additional details"
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            className="border border-gray-300 p-3.5 rounded-lg mb-4 text-base bg-gray-50"
          />
          <Text className="text-base font-medium text-gray-800 mb-3">Address Type</Text>
          <View className="flex-row flex-wrap justify-between mb-4">
            {['Home', 'Work', 'Hotel', 'Other'].map((type) => (
              <TouchableOpacity
                key={type}
                style={getTagStyle(type)}
                onPress={() => setAddressType(type)}
              >
                <View style={{ marginRight: 8 }}>
                  {type === 'Home' ? (
                    <Ionicons name="home" size={18} color="#f23e3e" />
                  ) : type === 'Work' ? (
                    <MaterialCommunityIcons name="briefcase-outline" size={18} color="#f23e3e" />
                  ) : type === 'Hotel' ? (
                    <MaterialCommunityIcons name="office-building" size={18} color="#f23e3e" />
                  ) : (
                    <FontAwesome5 name="map-marker-alt" size={16} color="#f23e3e" />
                  )}
                </View>
                <Text style={getTextStyle(type)}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-lg items-center"
            onPress={handleSaveAddress}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Save Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center p-4 border-b border-gray-300">
            <TouchableOpacity
              onPress={() => setShowSearchModal(false)}
              className="mr-4"
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-black">Search Location</Text>
          </View>
          <View style={styles.modalSearchWrapper}>
            <View style={styles.modalSearchField}>
              <Feather name="search" size={20} color="#6b7280" />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search for a location..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                autoFocus
              />
            </View>
          </View>
          {isSearching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#e41e3f" />
              <Text className="mt-2.5 text-base font-bold text-gray-600">Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleSelectSearchResult(item)}
                >
                  <Feather name="map-pin" size={16} color="#666" className="mr-2" />
                  <Text className="flex-1 text-base text-gray-800" numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : searchQuery.length > 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-base font-bold text-gray-600">No results found</Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Feather name="search" size={50} color="#ccc" />
              <Text className="mt-2.5 text-base font-bold text-gray-400">Search for a location</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  mapWrapper: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  currentLocationButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },
  currentLocationInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  searchTrigger: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  modalSearchWrapper: {
    margin: 16,
  },
  modalSearchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});






// // A minimal, safe version of MapPicker.jsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { useSafeNavigation } from '@/hooks/navigationPage';
// import { useLocationContext } from '@/context/LocationContext';
// import BackRouting from '@/components/BackRouting';
// // ... then inside the component:



// export default function MapPicker() {

//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View>
//         <Text style={styles.text}>Minimal MapPicker is working!</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//   },
// });