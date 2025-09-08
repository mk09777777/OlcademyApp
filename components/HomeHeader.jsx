import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLocationContext } from '@/context/LocationContext'; // or wherever your context is
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function LocationHeader() {
  const { location } = useLocationContext();
  const router = useRouter();
   const {safeNavigation} = useSafeNavigation();
  return (
    <View className="flex-row items-center p-2.5">
      <Ionicons name='location' size={24} color='#e23845' className="pt-1.5 pr-2" />
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => safeNavigation('/screens//SelectLocation')}
      >
        <View>
          <Text className="text-base font-bold text-textprimary">
            { location.city || 'Select Location'}
          </Text>
          <Text className="text-xs text-textsecondary">{location.state || ''}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );
}
