import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { router } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function QuickActions() {
  const { safeNavigation } = useSafeNavigation();
  return (
    <View className="flex-row justify-between p-4 bg-white">
      <TouchableOpacity className="flex-row items-center p-3 bg-light rounded-2xl flex-1 mr-2" onPress={() => safeNavigation('/screens/Collection')}>
        <Ionicons name="bookmark-outline" size={24} color={Colors.textLight} />
        <Text className="ml-2 text-textsecondary font-outfit">Collections</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center p-3 bg-light rounded-2xl flex-1 ml-2" onPress={() => safeNavigation('/screens/Activity')}>
      <View className="flex-row items-center">
      <Ionicons name="eye-outline" size={20} color="#000" className="mr-2" />
        <Text className="text-textprimary font-outfit">View activity ›</Text>
      </View>
    </TouchableOpacity>
    </View>
  );
}