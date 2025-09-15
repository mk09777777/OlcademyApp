import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator, TextInput, Modal,Dimensions  } from 'react-native';
import { ExpoMap as MapView, Marker } from 'expo-maps';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from '@/components/BackRouting';
import * as Location from 'expo-location';

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
    { type: 'Home', icon: <Icon name="home" size={18} /> },
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
    borderColor: selectedType === type ? '#f23e3e' : '#ccc',
    backgroundColor: selectedType === type ? '#ffe6e6' : '#fff',
  });

  const getTextStyle = (type) => ({
    marginLeft: 6,
    color: selectedType === type ? '#f23e3e' : '#555',
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e41e3f" />
        <Text style={{ marginTop: 10 }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BackRouting style={{ backgroundColor: '#f0f0f0' }} title='Select From Map' />
      
      {/* Search Box */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => setShowSearchModal(true)}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          editable={false}
          pointerEvents="none"
        />
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
      </TouchableOpacity>
   <MapView
        ref={mapRef}
        style={styles.map}
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
        style={styles.currentLocationBox}
        onPress={getCurrentLocation}
        disabled={isFetchingLocation}
      >
        <View style={styles.locationBoxContent}>
          <MaterialIcons name="my-location" size={20} color="#e41e3f" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>
              {isFetchingLocation ? 'Fetching your location...' : 'Use Current location'}
            </Text>
          </View>
          {isFetchingLocation && <ActivityIndicator size="small" color="#e41e3f" />}
        </View>
      </TouchableOpacity>
      
      <View style={styles.currentLocation}>
         <View style={styles.locationBoxContent}>
         <Ionicons name='location' size={24} color="#e41e3f"/>
        <Text style={styles.locationAddress} numberOfLines={2}>
          {currentAddress || 'Tap to get current location or move the map'}
        </Text>
        </View>
      </View>
      
      <View style={styles.tagsContainer}>
        <FlatList
          data={tagOptions}
          horizontal
          keyExtractor={(item) => item.type}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
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

      <TouchableOpacity style={styles.confirmBtn} onPress={handleSaveLocation}>
        <Text style={styles.confirmTxt}>Save Location</Text>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowSearchModal(false)}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Search Location</Text>
          </View>
          
          <View style={styles.modalSearchContainer}>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search for a location..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              autoFocus={true}
            />
            <Icon name="search" size={20} color="#666" style={styles.modalSearchIcon} />
          </View>

          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e41e3f" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSearchResult(item)}
                >
                  <Icon name="map-pin" size={16} color="#666" style={{ marginRight: 8 }} />
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : searchQuery.length > 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          ) : (
            <View style={styles.initialStateContainer}>
              <Icon name="search" size={50} color="#ccc" />
              <Text style={styles.initialStateText}>Search for a location</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmBtn: {
    marginHorizontal: 20,
    backgroundColor: '#e41e3f',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmTxt: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'outfit-bold'
  },
  tagsContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
  headerMap: {
     fontFamily:'outfit-bold',
    fontSize: 20,
    color: '#000',
  },
  map: {
    height: 400,
    width: '100%',
  },
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
  },
    currentLocation: {
    backgroundColor: '#fffefeff',
    marginTop:10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  locationBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationTitle: {
     fontFamily:'outfit-bold',
    fontSize: 16,
    color: '#000',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
       fontFamily:'outfit-medium',
  },
  // Search styles
  searchContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    paddingLeft: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    maxHeight:'80%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  modalTitle: {
       fontFamily:'outfit-bold',
    fontSize: 18,
    color: '#000',
  },
  modalSearchContainer: {
    position: 'relative',
    margin: 15,
  },
  modalSearchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    paddingLeft: 40,
    borderRadius: 10,
    fontSize: 16,
       fontFamily:'outfit-bold',
  },
  modalSearchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    flex: 1,
    fontFamily:'outfit-medium',
    fontSize: 15,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
     fontFamily:'outfit-bold',
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily:'outfit-bold',
    fontSize: 16,
    color: '#666',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialStateText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily:'outfit-bold',
    color: '#999',
  },
});