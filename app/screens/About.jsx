import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
const About = () => {
  const{safeNavigation} = useSafeNavigation();
  return (
    <View className="flex-1 bg-background p-4">
      {/* Terms of Service */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border" onPress={() => safeNavigation('/screens/TermsofService')}>
        <Text className="text-textprimary text-base font-outfit">Terms of Service</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>

      {/* App Version (non-clickable, no chevron) */}
      <View className="py-4 px-4 bg-white rounded-lg mb-3 border border-border">
        <View>
          <Text className="text-textsecondary text-sm font-outfit">App version</Text>
          <Text className="text-textprimary text-base font-outfit-bold">v18.9.0 Live</Text>
        </View>
      </View>

      {/* Open Source Libraries */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border">
        <Text className="text-textprimary text-base font-outfit">Open Source Libraries</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>

      {/* Licenses and Registrations */}
      <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border" onPress={() => safeNavigation('/screens/LicenseScreen')}>
        <Text className="text-textprimary text-base font-outfit">Licenses and Registrations</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );
};


export default About;
