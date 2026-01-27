import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import BackRouting from "@/components/BackRouting";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectLocation() {
  const { safeNavigation } = useSafeNavigation();
  const { 
    updateLocation, 
    recentlyAdds, 
    setRecentlyAdds, 
    refreshLocation, 
    locationMetadata, 
    resetToGPS,
    searchPlaces,
    selectPlace,
  } = useLocationContext();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);
  
  const debounceRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Load recent locations on focus
  useFocusEffect(
    useCallback(() => {
      const loadRecent = async () => {
        try {
          const data = await AsyncStorage.getItem('recentlyAddList');
          if (data) setRecentlyAdds(JSON.parse(data));
        } catch (e) {
          // Ignore
        }
      };
      loadRecent();
    }, [setRecentlyAdds])
  );

  // Search with debounce
  const handleSearch = useCallback((text) => {
    setQuery(text);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;
      
      setIsSearching(true);
      try {
        const results = await searchPlaces(text);
        if (isMountedRef.current) {
          setSuggestions(results);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        if (isMountedRef.current) {
          setIsSearching(false);
        }
      }
    }, 300);
  }, [searchPlaces]);

  // Select a suggestion
  const handleSelectSuggestion = useCallback(async (place) => {
    setIsSearching(true);
    
    try {
      const result = await selectPlace(place);
      
      if (result) {
        setQuery('');
        setSuggestions([]);
        safeNavigation('/home');
      } else {
        Alert.alert('Error', 'Could not select this location. Please try again.');
      }
    } catch (error) {
      console.error('Select error:', error);
      Alert.alert('Error', 'Failed to select location');
    } finally {
      setIsSearching(false);
    }
  }, [selectPlace, safeNavigation]);

  // Select from recent locations
  const handleSelectRecent = useCallback(async (item) => {
    await updateLocation(item, 'manual');
    safeNavigation('/home');
  }, [updateLocation, safeNavigation]);

  // Use current GPS location
  const handleUseCurrentLocation = useCallback(async () => {
    setIsFetchingGPS(true);
    
    try {
      const result = await refreshLocation(true);
      
      if (result && result.lat) {
        safeNavigation('/home');
      } else {
        Alert.alert('Error', 'Could not get current location. Please try again.');
      }
    } catch (error) {
      console.error('GPS error:', error);
      Alert.alert('Error', 'Could not get current location.');
    } finally {
      setIsFetchingGPS(false);
    }
  }, [refreshLocation, safeNavigation]);

  // Reset to GPS
  const handleResetToGPS = useCallback(async () => {
    setIsFetchingGPS(true);
    
    try {
      const result = await resetToGPS();
      
      if (result) {
        Alert.alert('Success', 'Switched back to GPS location');
        safeNavigation('/home');
      } else {
        Alert.alert('Error', 'Could not get GPS location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset to GPS');
    } finally {
      setIsFetchingGPS(false);
    }
  }, [resetToGPS, safeNavigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting className="bg-white" tittle="Select Location" />
      
      <ScrollView keyboardShouldPersistTaps="handled" className="bg-white">
        {/* Search Input */}
        <View className="p-4">
          <TextInput
            mode="outlined"
            placeholder="Search for area, street name..."
            value={query}
            onChangeText={handleSearch}
            className="bg-white"
            theme={{
              colors: { 
                text: '#000', 
                onSurface: '#000', 
                primary: '#02757A', 
                placeholder: '#666' 
              }
            }}
            placeholderTextColor="#666"
            left={<TextInput.Icon icon="magnify" />}
            right={
              isSearching ? (
                <TextInput.Icon icon={() => <ActivityIndicator size="small" color="#02757A" />} />
              ) : query ? (
                <TextInput.Icon icon="close" onPress={() => {
                  setQuery('');
                  setSuggestions([]);
                }} />
              ) : null
            }
            outlineColor="#ddd"
            activeOutlineColor="#02757A"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <View className="mx-4 bg-white rounded-lg border border-gray-200 mb-4">
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={item.placeId || index}
                className={`p-4 flex-row items-center ${index < suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                onPress={() => handleSelectSuggestion(item)}
              >
                <MaterialIcons name="location-on" size={20} color="#02757A" />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-outfit-medium text-gray-800">
                    {item.mainText}
                  </Text>
                  <Text className="text-sm font-outfit text-gray-500 mt-0.5" numberOfLines={1}>
                    {item.secondaryText}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View className="bg-white mx-5 rounded-xl">
          {/* Add Address on Map */}
          <TouchableOpacity
            className="bg-primary p-3 rounded-lg mb-3 items-center justify-center flex-row"
            onPress={() => safeNavigation('/screens/MapPicker')}
          >
            <MaterialIcons name="add-location" size={24} color="white" />
            <Text className="text-white font-outfit-bold ml-2">Add Address on Map</Text>
          </TouchableOpacity>

          {/* Use Current Location */}
          <TouchableOpacity
            className="bg-blue-50 p-3 rounded-lg mb-3 items-center flex-row justify-center"
            onPress={handleUseCurrentLocation}
            disabled={isFetchingGPS}
          >
            {isFetchingGPS ? (
              <ActivityIndicator size="small" color="#02757A" />
            ) : (
              <>
                <MaterialIcons name="my-location" size={20} color="#02757A" />
                <Text className="text-gray-800 font-outfit-bold ml-2">Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Reset to GPS (if manual) */}
          {locationMetadata?.source === 'manual' && (
            <TouchableOpacity
              className="bg-gray-100 p-3 rounded-lg mb-3 items-center flex-row justify-center"
              onPress={handleResetToGPS}
              disabled={isFetchingGPS}
            >
              <MaterialIcons name="gps-fixed" size={18} color="#666" />
              <Text className="text-gray-600 font-outfit-medium text-sm ml-2">Reset to GPS Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Locations */}
        {recentlyAdds.length > 0 && (
          <>
            <View className="flex-row items-center mt-6 mb-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-sm text-gray-400 mx-3 font-outfit-bold">RECENT LOCATIONS</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <View className="mx-5 mb-6">
              {recentlyAdds.map((item, index) => (
                <TouchableOpacity
                  key={`recent-${index}`}
                  className="flex-row bg-white rounded-xl p-3 mb-2 border border-gray-100"
                  onPress={() => handleSelectRecent(item)}
                >
                  <View className="justify-center items-center mr-3">
                    <FontAwesome6 name="clock-rotate-left" size={16} color="#999" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-outfit-medium text-gray-800">
                      {item.city || item.area || 'Unknown'}
                    </Text>
                    <Text className="text-sm font-outfit text-gray-500 mt-0.5" numberOfLines={2}>
                      {item.fullAddress}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}