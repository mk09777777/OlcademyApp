import { View, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useSafeNavigation } from '@/hooks/navigationPage'

export default function PhoneNumberEntry() {
  const { safeNavigation } = useSafeNavigation();
  const handleNumberChange = (text) => {
		if(text.length === 10){
			setPhoneNumber(dialCode+text)
		}
		else{
			setPhoneNumber('')
		}
	}
  const router = useRouter()
  return (
    <View
      style={styles.phoneNumberEntry}
    >
      <TouchableOpacity
        style={styles.selectCountryCode}
        onPress={() => {
          safeNavigation('/auth/SearchCountryCode')
        }}
      >
        <Image 
          source={{uri: `https://flagsapi.com/${countryCode}/flat/24.png`}}
          style={styles.countryIcon}
        />
        <AntDesign name="caretdown" size={16} color="gray" />
      </TouchableOpacity>
      <View
        style={styles.phoneNumberInputContainer}
      >
        <TextInput 
          style={styles.phoneNumberInput}
          keyboardType='number-pad'
          onChangeText={handleNumberChange}
        />
      </View>
    </View>
  )
}