import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from '@/components/BackRouting';

export default function MapPicker() {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  const { setLocation, setRecentlyAdds } = useLocationContext();

  const [region, setRegion] = useState({
    latitude: 19.1573,
    longitude: 73.2631,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const tagOptions = [
    { type: 'Home', icon: <Icon name="home" size={18} /> },
    { type: 'Work', icon: <MaterialCommunityIcons name="briefcase-outline" size={18} /> },
    { type: 'Hotel', icon: <MaterialCommunityIcons name="office-building" size={18} /> },
    { type: 'Other', icon: <FontAwesome5 name="map-marker-alt" size={16} /> },
  ];

  const fetchlatlong = async () => {
    try {
      const response = await axios.get('https://backend-0wyj.onrender.com/api/location');
      const { lat, lon } = response.data;
      const newRegion = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setMarkerCoordinate(newRegion);
    } catch (err) {
      console.log('Error fetching lat/long:', err);
    }
  };

  useEffect(() => {
    fetchlatlong();
  }, []);

  // Search for locations using Nominatim
  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'ProjectZ/1.0.0 (mayurvicky01234@gmail.com)',
          },
        }
      );
      
      setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.log('Search error:', error);
      Alert.alert('Error', 'Failed to search locations');
    }
  };

  // Handle search input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchResultSelect = (result) => {
    const newRegion = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    
    setRegion(newRegion);
    setMarkerCoordinate(newRegion);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
    setRegion({
      ...region,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

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
      return null;
    }
  };

  const handleSaveLocation = async () => {
    if (!selectedType) {
      Alert.alert('Select Type', 'Please choose a location type (Home, Work, etc.)');
      return;
    }

    if (!markerCoordinate) {
      Alert.alert('Select Location', 'Please select a location on the map');
      return;
    }

    const { latitude, longitude } = markerCoordinate;
    const geo = await reverseGeocode(latitude, longitude);
    if (!geo) return;

    setLocation({
      city: geo.city || '',
      state: geo.state || '',
      country: geo.country || '',
      lat: latitude,
      lon: longitude,
      fullAddress: geo.fullAddress,
      area: '',
      street: '',
      houseNumber: '',
    });

    const addressUpload = geo.fullAddress;
    const serviceArea = selectedType;

    try {
      await axios.post(
        'https://backend-0wyj.onrender.com/api/createUserAddress',
        [
          {
            address: addressUpload,
            service_area: serviceArea,
          },
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      router.back();
    } catch (error) {
      console.log('error in uploading the address', error.response?.data || error.message);
    }
  };

  const getTagStyle = (type) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 14,
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

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, backgroundColor:'#ffffffff' }}>
        <BackRouting tittle='Select Map'/>
        {/* <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={styles.headerMap}>Select From Map</Text>
        </View> */}
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
          />
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          
          {searchResults.length > 0 && isSearching && (
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.place_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => handleSearchResultSelect(item)}
                  >
                    <Text style={styles.searchResultText} numberOfLines={1}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <MapView
          style={{ height: 300, width: '100%' }}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          {markerCoordinate && (
            <Marker coordinate={markerCoordinate} />
          )}
        </MapView>
        
        <View style={styles.tagsContainer}>
          <FlatList
            data={tagOptions}
            horizontal
            keyExtractor={(item) => item.type}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsList}
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  confirmBtn: {
    position: 'relative',
    bottom: 10,
    marginHorizontal: 20,
    backgroundColor: '#e41e3f',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagsContainer: {
    margin: 10,
  },
  tagsList: {
    justifyContent: 'flex-start',
  },
  headerMap: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    paddingLeft: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 14,
    color: '#333',
  },
});