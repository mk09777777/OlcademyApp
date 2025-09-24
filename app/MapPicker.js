import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, ActivityIndicator, TextInput, Modal,Dimensions  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from '@/components/BackRouting';
import * as Location from 'expo-location';

/*
=== ORIGINAL CSS REFERENCE ===
confirmBtn: {
  marginHorizontal: 20,
  backgroundColor: '#e41e3f',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 20,
}

confirmTxt: {
  color: '#fff',
  fontSize: 16,
  fontFamily:'outfit-bold'
}

tagsContainer: {
  flexDirection: 'row',
  padding: 10,
  justifyContent: 'center',
}

map: {
  height: 400,
  width: '100%',
}

currentLocationBox: {
  position: 'absolute',
  bottom:300,
  left: 70,
  right: 70,
  backgroundColor: '#fffefeff',
  padding: 10,
  borderRadius: 30,
  borderWidth: 1,
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

modalContainer: {
  flex: 1,
  backgroundColor: '#fff',
  maxHeight:'80%'
}

modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
}

backButton: {
  marginRight: 15,
}

modalTitle: {
  fontFamily:'outfit-bold',
  fontSize: 18,
  color: '#000',
}

modalSearchContainer: {
  position: 'relative',
  margin: 15,
}

modalSearchInput: {
  backgroundColor: '#f0f0f0',
  padding: 12,
  paddingLeft: 40,
  borderRadius: 10,
  fontSize: 16,
  fontFamily:'outfit-bold',
}

modalSearchIcon: {
  position: 'absolute',
  left: 12,
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

export default function MapPicker() {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  const { setLocation, setRecentlyAdds, location: currentLocation } = useLocationContext();
  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 19.1573,
    longitude: 73.2631,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedType, setSelectedType] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

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
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        const address = `${location.name || ''} ${location.street || ''}, ${location.city || ''}, ${location.region || ''}, ${location.country || ''}`.trim();
        return address;
      }
      return `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
    }
  };

  // Handle selection of a search result - COMPLETELY REWRITTEN
  const handleSelectSearchResult = async (result) => {
    try {
      console.log('Selected result:', result);
      
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      
      const newRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      console.log('New region:', newRegion);

      // Update map region and selected coordinate
      setRegion(newRegion);
      setSelectedCoordinate({ latitude: lat, longitude: lon });
      
      // Update address - use the display_name from the result directly
      setCurrentAddress(result.display_name);
      
      // Animate map to the new location with timeout to ensure map is ready
      setTimeout(() => {
        if (mapRef.current) {
          console.log('Animating map to new location');
          mapRef.current.animateToRegion(newRegion, 1000);
        } else {
          console.log('Map ref not available');
        }
      }, 100);
      
      // Close modal and clear search
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      // Update map region to current location
      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setSelectedCoordinate({ latitude: coords.latitude, longitude: coords.longitude });

      // Animate map to the new location
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }, 100);

      // Reverse geocode to get address
      const address = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setCurrentAddress(address);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Could not get current location. Please try again.');
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

    // Update address display when user moves the map
    const address = await reverseGeocodeCoordinates(newRegion.latitude, newRegion.longitude);
    setCurrentAddress(address);
  };

  // Initialize with current location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);

        // If current location is available in context, use it
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
          } else {
            const address = await reverseGeocodeCoordinates(lat, lon);
            setCurrentAddress(address);
          }

          // Animate to the location after a short delay to ensure map is rendered
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
            }
          }, 500);
        } else {
          // Try to get device location if no context location
          await getCurrentLocation();
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        // Fallback to default location
        setCurrentAddress('Tap to get current location');
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

  const handleSaveLocation = async () => {
    if (!selectedType) {
      Alert.alert('Select Type', 'Please choose a location type (Home, Work, etc.)');
      return;
    }

    if (!selectedCoordinate) {
      Alert.alert('Select Location', 'Please select a location on the map');
      return;
    }

    const { latitude, longitude } = selectedCoordinate;
    const geo = await reverseGeocode(latitude, longitude);
    if (!geo) return;

    const locationData = {
      city: geo.city || '',
      state: geo.state || '',
      country: geo.country || '',
      lat: latitude.toString(),
      lon: longitude.toString(),
      fullAddress: geo.fullAddress,
      area: '',
      street: '',
      houseNumber: '',
    };

    setLocation(locationData);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('currentLocation', JSON.stringify(locationData));
    } catch (error) {
      console.error('Error saving location:', error);
    }

    router.back();
  };

  const getTagStyle = (type) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 15,
    marginRight: 4,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: selectedType === type ? '#f23e3f' : '#ccc',
    backgroundColor: selectedType === type ? '#ffe6e6' : '#fff',
  });

  const getTextStyle = (type) => ({
    marginLeft: 6,
    color: selectedType === type ? '#f23e3f' : '#555',
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#e41e3f" />
        <Text className="mt-2.5">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <BackRouting style={{ backgroundColor: '#f0f0f0' }} title='Select From Map' />
      
      {/* Search Box */}
      <TouchableOpacity 
        className="relative mx-5 mt-2.5 mb-2.5"
        onPress={() => setShowSearchModal(true)}
      >
        <TextInput
          className="bg-white p-3 pl-10 rounded-lg border border-gray-300 text-base"
          placeholder="Search for a location..."
          value={searchQuery}
          editable={false}
          pointerEvents="none"
        />
        <Feather name="search" size={20} color="#666" className="absolute left-3 top-3" />
      </TouchableOpacity>
   <MapView
        ref={mapRef}
        className="h-96 w-full"
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={(e) => {
          const { coordinate } = e.nativeEvent;
          setSelectedCoordinate(coordinate);
          reverseGeocodeCoordinates(coordinate.latitude, coordinate.longitude)
            .then(address => setCurrentAddress(address));
        }}
      >
        {selectedCoordinate && (
          <Marker 
            coordinate={selectedCoordinate} 
            pinColor="#e41e3f"
          />
        )}
      </MapView>
      
      <TouchableOpacity
        className="absolute bottom-72 left-16 right-16 bg-white p-2.5 rounded-full border border-gray-300 shadow-lg"
        onPress={getCurrentLocation}
        disabled={isFetchingLocation}
      >
        <View className="flex-row items-center">
          <MaterialIcons name="my-location" size={20} color="#e41e3f" />
          <View className="flex-1 ml-2.5">
            <Text className="text-base font-bold text-black">
              {isFetchingLocation ? 'Fetching your location...' : 'Use Current location'}
            </Text>
          </View>
          {isFetchingLocation && <ActivityIndicator size="small" color="#e41e3f" />}
        </View>
      </TouchableOpacity>
      
      <View className="bg-white mt-2.5 mx-5 p-4 rounded-lg border border-gray-300 shadow-sm">
         <View className="flex-row items-center">
         <Ionicons name='location' size={24} color="#e41e3f"/>
        <Text className="text-sm text-gray-600 mt-0.5 ml-2.5 flex-1" numberOfLines={2}>
          {currentAddress || 'Tap to get current location or move the map'}
        </Text>
        </View>
      </View>
      
      <View className="flex-row p-2.5 justify-center">
        <FlatList
          data={tagOptions}
          horizontal
          keyExtractor={(item) => item.type}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{flexDirection: 'row', padding: 10, justifyContent: 'center'}}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={getTagStyle(item.type)}
              onPress={() => setSelectedType(item.type)}
            >
              {item.icon}
              <Text style={getTextStyle(item.type)}>{item.type}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity className="mx-5 bg-red-600 p-3.5 rounded-lg items-center mb-5" onPress={handleSaveLocation}>
        <Text className="text-white text-base font-bold">Save Location</Text>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View className="flex-1 bg-white max-h-[80%]">
          <View className="flex-row items-center p-4 border-b border-gray-300">
            <TouchableOpacity 
              onPress={() => setShowSearchModal(false)}
              className="mr-4"
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-black">Search Location</Text>
          </View>
          
          <View className="relative m-4">
            <TextInput
              className="bg-gray-100 p-3 pl-10 rounded-lg text-base font-bold"
              placeholder="Search for a location..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              autoFocus={true}
            />
            <Feather name="search" size={20} color="#666" className="absolute left-3 top-3" />
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
        </View>
      </Modal>
    </View>
  );
}

