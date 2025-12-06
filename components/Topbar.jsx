import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';

export default function TopBar() {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();

  return (
    <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
      {/* Location Section */}
      <View className="flex-row items-center flex-1">
        <MaterialIcons name="location-on" size={24} color="#E41E3F" />
        <View className="ml-2 flex-1">
          <Text className="text-xs text-gray-500">Location</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-base text-gray-800 font-medium flex-1" numberOfLines={1}>
              123 Main Street, City, Country
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Button */}
      <TouchableOpacity 
        className="ml-4 p-2"
        onPress={() => safeNavigation('/screens/User')}
      >
        <MaterialIcons name="person" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
}


/* ---------------- OLD STYLESHEET (COMMENTED OUT) ----------------
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressContainer: {
    marginLeft: 8,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  profileButton: {
    marginLeft: 16,
    padding: 8,
  },
});
------------------------------------------------------------------ */
