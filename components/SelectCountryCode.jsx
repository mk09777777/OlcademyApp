import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '@/styles/SelectCountryCodesStyles'
import CountryList from 'country-list-with-dial-code-and-flag'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeNavigation } from '@/hooks/navigationPage'
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
  const handleSelect = (item) => {
    safeNavigation({
      pathname: '/',
      params: { selectedCountry: JSON.stringify(item) },
    });
  }
  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => {
          router.back()
        }}
      >
      <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a country"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredCountries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelect(item)}
          >
            <Image 
              source={require('../assets/images/food.jpg')}
              style={styles.countryIcon}
            >
            </Image>
            <Text 
              style={styles.itemText}
            >
              {item.name}
            </Text>
            <Text
              style={styles.itemText}
            >
              {item.data.dial_code}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}