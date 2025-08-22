import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
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

const screenHeight = Dimensions.get('window').height;

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
  const [locationName, setLocationName] = useState({
     city:  '',
      state:  '',
      country:  '',
      fullAddress:'',
      area: '',
      street: '',
      houseNumber: '',
  });

  const tagOptions = [
    { type: 'Other', icon: <FontAwesome5 name="map-marker-alt" size={14} color="#555" /> },
    { type: 'Hotel', icon: <MaterialCommunityIcons name="office-building" size={14} color="#555" /> },
    { type: 'Work', icon: <MaterialCommunityIcons name="briefcase-outline" size={14} color="#555" /> },
    { type: 'Home', icon: <Icon name="home" size={14} color="#555" /> },
  ];

  const fetchlatlong = async () => {
    try {
      const response = await axios.get('http://192.168.0.101:3000/api/location');
      const { lat, lon } = response.data;
      setRegion({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (err) {
      console.log('Error fetching lat/long:', err);
    }
  };

  useEffect(() => {
    fetchlatlong();
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
      };

      const existing = await AsyncStorage.getItem('recentlyAddList');
      let parsed = existing ? JSON.parse(existing) : [];
      parsed = parsed.filter(item => item.fullAddress !== recentEntry.fullAddress);
      parsed.unshift(recentEntry);
      if (parsed.length > 5) parsed = parsed.slice(0, 5);
      await AsyncStorage.setItem('recentlyAddList', JSON.stringify(parsed));
      setRecentlyAdds(parsed);

      const addressLines = fullAddress.split(',');
      const shortAddress = addressLines.slice(0, 2).join('\n');
      setLocationName(shortAddress);

      return recentEntry;
    } catch (err) {
      console.log('Reverse geocoding failed:', err.message || err);
      return null;
    }
  };

  const handleSaveLocation = async () => {
    if (!selectedType) {
      Alert.alert('Select Type', 'Please choose a location type');
      return;
    }

    const { latitude, longitude } = region;
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
    setLocationName({
       city: geo.city || '',
      state: geo.state || '',
      country: geo.country || '',
      lat: latitude,
      lon: longitude,
      fullAddress: geo.fullAddress,
      area: '',
      street: '',
      houseNumber: '',
    })

    try {
      await axios.post(
        'http://192.168.0.101:3000/api/createUserAddress',
        [
          {
            address: geo.fullAddress,
            service_area: selectedType,
          },
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      safeNavigation('/home');
    } catch (error) {
      console.log('Error saving location:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <BackRouting />
          <Text style={styles.headerTitle}>Select From Map</Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            <Marker coordinate={region} />
          </MapView>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{locationName.city}</Text>
        </View>

        <View style={styles.tagsContainer}>
          <FlatList
            data={tagOptions}
            horizontal
            keyExtractor={(item) => item.type}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tag,
                  selectedType === item.type && styles.selectedTag
                ]}
                onPress={() => setSelectedType(item.type)}
              >
                {item.icon}
                <Text style={[
                  styles.tagText,
                  selectedType === item.type && styles.selectedTagText
                ]}>
                  {item.type}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 16,
  },
  mapContainer: {
    height: screenHeight * 0.55, 
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 0,
  },
  map: {
    flex: 1,
  },
  locationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  tagsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  tagsList: {
    paddingBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedTag: {
    borderColor: '#e41e3f',
    backgroundColor: '#ffeaea',
  },
  tagText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  selectedTagText: {
    color: '#e41e3f',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#e41e3f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});