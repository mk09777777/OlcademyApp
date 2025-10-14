import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import CountryList from 'country-list-with-dial-code-and-flag'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeNavigation } from '@/hooks/navigationPage'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function SelectCountryCode() {
  const router = useRouter()
  const { safeNavigation } = useSafeNavigation();
  const [searchText, setSearchText] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  useEffect(() => {
    setFilteredCountries(CountryList.getAll())
  }, [])
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCountries(CountryList.getAll());
    } else {
      setFilteredCountries(CountryList.findByKeyword(text.trim()));
    }
  }
  const handleSelect = async (item) => {
    try {
      await AsyncStorage.setItem('pendingCountrySelection', JSON.stringify(item));
    } catch (storageError) {
      console.error('Failed to store selected country', storageError);
      Alert.alert('Unable to save selection', 'Please try choosing a country again.');
    } finally {
      router.back();
    }
  }
  return (
    <View className="flex-1 bg-background p-4">
      <TouchableOpacity
        onPress={() => {
          router.back()
        }}
      >
      <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        className="bg-white border border-border rounded-lg p-3 mb-4 text-textprimary font-outfit"
        placeholder="Search for a country"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredCountries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-4 bg-white mb-2 rounded-lg border border-border"
            onPress={() => handleSelect(item)}
          >
            <Image 
              source={require('../assets/images/food.jpg')}
              className="w-8 h-8 rounded mr-3"
            >
            </Image>
            <Text className="flex-1 text-textprimary font-outfit text-base">
              {item.name}
            </Text>
            <Text className="text-textsecondary font-outfit text-base">
              {item.data.dial_code}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}