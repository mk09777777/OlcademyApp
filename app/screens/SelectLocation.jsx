import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useLocationContext } from '@/context/LocationContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BackRouting from "@/components/BackRouting";
const CUSTOM_LOCATION_API = 'http://192.168.0.101:3000/api/location';

export default function SelectLocation({ placeholder = "Enter area, landmark ...", query, setQuery }) {
  const { safeNavigation } = useSafeNavigation();
  const { setLocation, recentlyAdds, setRecentlyAdds } = useLocationContext();

  const [localQuery, setLocalQuery] = useState(query || '');
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({ latitude: 17.385044, longitude: 78.486671 });
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchSuggestions = async (text) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ProjectZ/1.0.0 (mayurvicky01234@gmail.com)',
          },
        }
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error('Error fetching suggestions', err);
    }
  };

  const handleSuggestionSelect = async (item) => {
    const address = item.address || {};
    const { city, town, village, suburb, county, state, country } = address;
    const selectedCity = item.city || city || town || village || suburb || county || 'Unknown';
    const fullAddress = item.fullAddress || item.display_name || 'Unknown';

    const locationData = {
      id: item.id || item.place_id,
      city: selectedCity,
      state: item.state || state || '',
      country: item.country || country || '',
      lat: item.lat,
      lon: item.lon,
      fullAddress,
      address: item.address || {},
      display_name: item.display_name || '',
      area: '',
      street: '',
      houseNumber: '',
    };

    setLocation(locationData);

    try {
      const existing = await AsyncStorage.getItem('recentlyAddList');
      let parsed = existing ? JSON.parse(existing) : [];
      parsed = parsed.filter(i => i.fullAddress !== fullAddress);
      parsed.unshift(locationData);
      if (parsed.length > 5) parsed = parsed.slice(0, 5);
      await AsyncStorage.setItem('recentlyAddList', JSON.stringify(parsed));
      setRecentlyAdds(parsed);
    } catch (err) {
      console.error("Failed to update recent list", err);
    }

    setLocalQuery(fullAddress);
    setSuggestions([]);
    safeNavigation('/home');
  };

  const loadRecentlyAdds = async () => {
    try {
      const data = await AsyncStorage.getItem('recentlyAddList');
      if (data) setRecentlyAdds(JSON.parse(data));
    } catch (e) {
      console.log('Error loading recentlyAddList:', e);
    }
  };

  useEffect(() => {
    loadRecentlyAdds();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentlyAdds();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackRouting style ={{backgroundColor: '#f0f0f0' }}/>
      <ScrollView keyboardShouldPersistTaps="handled" style ={{backgroundColor: '#f0f0f0'}}>
        <Text style={styles.header}>Select Location</Text>
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder={placeholder}
            value={localQuery}
            onChangeText={(text) => {
              setLocalQuery(text);
              if (debounceTimer) clearTimeout(debounceTimer);
              setDebounceTimer(setTimeout(() => {
                text.length > 2 ? fetchSuggestions(text) : setSuggestions([]);
              }, 500));
            }}
            style={styles.searchInput}
            theme={{ colors: { text: '#000' } }}
            left={<TextInput.Icon icon="magnify" />}
            right={
              loading ? (
                <TextInput.Icon icon="loading" />
              ) : localQuery ? (
                <TextInput.Icon icon="close" onPress={() => setLocalQuery('')} />
              ) : (
                <TextInput.Icon icon={() => (
                  <TouchableOpacity><MaterialIcons name="keyboard-voice" size={24} color="#000" /></TouchableOpacity>
                )} />
              )
            }
            outlineColor="#ddd"
            activeOutlineColor="#E41E3F"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={suggestions}
          keyExtractor={item => item.place_id.toString()}
          style={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect({ ...item, id: item.place_id })}
            >
              <Text style={styles.suggestionText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={{ backgroundColor: "#fff", marginLeft: 20, marginRight: 20, borderRadius: 10, elevation: 3 }}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => safeNavigation({ pathname: '/MapPicker' })}
          >
            <Text style={{ color: 'white', fontSize: 26 }}>+</Text>
            <Text style={styles.addBtnTxt}> Add Address</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.useLocationBtn}
            onPress={async () => {
              try {
                setLoading(true);
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  return Alert.alert('Permission denied');
                }
                const { coords } = await Location.getCurrentPositionAsync({});
                setRegion(coords);
                const response = await fetch(CUSTOM_LOCATION_API);
                const data = await response.json();
                setLocation({
                  city: data.city || '',
                  state: data.state || '',
                  country: data.country || '',
                  lat: data.lat || coords.latitude,
                  lon: data.lon || coords.longitude,
                  fullAddress: `${data.city}, ${data.state}, ${data.country}`,
                  area: '',
                  street: '',
                  houseNumber: '',
                });
                safeNavigation('/home');
              } catch (err) {
                Alert.alert('Error', 'Could not get current location.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.useLocationTxt}>{loading ? 'Fetching...' : '📍 Use Current Location'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separatorRow}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Recent locations</Text>
          <View style={styles.line} />
        </View>

        <FlatList
          data={recentlyAdds}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionSelect(item)} style={styles.RecentlyContainer}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <FontAwesome6 name="clock" size={20} color="#999999" style={styles.Logo} />
              </View>
              <View style={styles.RecentlyTextContainer}>
                <Text style={styles.RecText1}>{item.city || 'Unknown City'}</Text>
                <Text style={styles.RecText2}>{item.fullAddress}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0' },
  header: { fontSize: 20, fontWeight: '600', margin: 20 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10, borderRadius: 20 },
  searchInput: { backgroundColor: '#fff' },
  addBtn: {
    backgroundColor: '#e41e3f',
    marginHorizontal: 20,
    padding: 8,
    borderRadius: 7,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10
  },
  addBtnTxt: { color: '#fff', fontWeight: 'bold' },
  suggestionList: { backgroundColor: '#fff', maxHeight: 150, marginHorizontal: 20 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  suggestionText: { color: '#000' },
  useLocationBtn: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    marginTop: 3
  },
  useLocationTxt: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10
  },
  line: { flex: 1, height: 0.6, backgroundColor: '#ccc' },
  separatorText: {
    fontSize: 18,
    color: '#999999',
    marginHorizontal: 7,
    fontWeight: "500"
  },
  RecentlyContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 7,
    padding: 10,
    elevation: 3,
    marginBottom: 10
  },
  RecentlyTextContainer: {
    flexDirection: "column",
    marginRight: 40
  },
  Logo: {
    marginLeft: 3,
    marginRight: 15,
  },
  RecText1: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  RecText2: {
    color: "black",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 4
  }
});
