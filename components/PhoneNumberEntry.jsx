import { View, Image, TouchableOpacity, TextInput, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { styles } from '@/styles/PhoneNumberInputStyles'

const STORAGE_KEY = 'pendingCountrySelection'
const DEFAULT_COUNTRY = {
  code: 'IN',
  name: 'India',
  data: { dial_code: '+91' },
}

export default function PhoneNumberEntry({ value = '', onChangePhone, onCountryChange }) {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY)
  const [phoneNumber, setPhoneNumber] = useState(value)

  const dialCode = selectedCountry?.data?.dial_code ?? '+1'
  const countryCode = selectedCountry?.code ?? 'US'

  useEffect(() => {
    setPhoneNumber(value)
  }, [value])

  useFocusEffect(
    useCallback(() => {
      const syncCountrySelection = async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            setSelectedCountry(parsed)
            onCountryChange?.(parsed)
            await AsyncStorage.removeItem(STORAGE_KEY)
          }
        } catch (error) {
          console.error('Failed to load selected country', error)
        }
      }

      syncCountrySelection()
    }, [onCountryChange])
  )

  const handleNumberChange = (text) => {
    const sanitized = text.replace(/[^0-9]/g, '')
    setPhoneNumber(sanitized)

    if (onChangePhone) {
      onChangePhone(sanitized ? `${dialCode}${sanitized}` : '')
    }
  }

  const openCountryPicker = () => {
    router.push('/auth/SearchCountryCode')
  }

  return (
    <View className="flex-row items-center border border-gray-300 rounded-lg">
      <TouchableOpacity
        className="flex-row items-center px-3 py-3 border-r border-gray-300"
        onPress={openCountryPicker}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: `https://flagsapi.com/${countryCode}/flat/32.png` }}
          className="w-8 h-8 mr-2"
        />
  <Ionicons name="chevron-down" size={16} color="gray" />
      </TouchableOpacity>

      <View className="flex-row items-center flex-1 px-3">
        <Text className="text-gray-700 mr-2">{dialCode}</Text>
        <TextInput
          className="flex-1 py-3 text-base"
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={handleNumberChange}
          maxLength={10}
          placeholder="Phone number"
          placeholderTextColor="#94a3b8"
        />
      </View>
    </View>
  )
}