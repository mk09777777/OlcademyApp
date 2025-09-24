import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { API_CONFIG } from '../../config/apiConfig';
import BackRouting from '@/components/BackRouting';

export default function AddressMapPicker() {
  const [address, setAddress] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  const API_BASE_URL = API_CONFIG.BACKEND_URL;

  useEffect(() => {
    (async () => {
      setIsLoadingLocation(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to select an address.');
          setIsLoadingLocation(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setMarker({ latitude, longitude });
        await reverseGeocode(latitude, longitude);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Failed to get current location. Using default location.');
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const addressData = response.data;
      setAddress(addressData.display_name || 'Unknown address');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      Alert.alert('Error', 'Failed to fetch address. Please enter manually.');
      setAddress('');
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion({
      ...region,
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    await reverseGeocode(latitude, longitude);
  };

  const handleSaveAddress = async () => {
    if (!address || !addressType) {
      Alert.alert('Error', 'Please provide an address and select a type.');
      return;
    }
    if (!marker) {
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
            latitude: marker.latitude,
            longitude: marker.longitude,
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
      router.push('screens/Address');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Ionicons name="home" size={18} color="#f23e3e" />;
      case 'Work':
        return <MaterialCommunityIcons name="briefcase-outline" size={18} color="#f23e3e" />;
      case 'Hotel':
        return <MaterialCommunityIcons name="office-building" size={18} color="#f23e3e" />;
      default:
        return <FontAwesome5 name="map-marker-alt" size={16} color="#f23e3e" />;
    }
  };

  if (isLoadingLocation) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#f23e3e" />
        <Text className="mt-4 text-gray-600 text-base">Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting title="Add Address" />
      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {marker && (
            <Marker
              coordinate={marker}
              draggable
              onDragEnd={(e) => handleMapPress(e)}
            />
          )}
        </MapView>
        <View className="p-4 bg-white rounded-t-xl -mt-4 shadow-lg">
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
                className={`w-[48%] flex-row items-center p-3 mb-3 border rounded-lg ${
                  addressType === type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onPress={() => setAddressType(type)}
              >
                <View className="mr-2">{getTypeIcon(type)}</View>
                <Text className="text-sm">{type}</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});