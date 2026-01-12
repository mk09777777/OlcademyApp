import React from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeNavigation } from '@/hooks/navigationPage';
export const Header = ({
  searchQuery,
  setSearchQuery,
  currentLocation,
  router,
  locationOpacity,
  headerHeight
}) => {
  const { safeNavigation } = useSafeNavigation();
  return (
    <Animated.View className="bg-background px-4 py-2" style={{ height: headerHeight }}>
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity className="flex-row items-center flex-1">
          <MaterialCommunityIcons name="map-marker" size={24} color="#FF4500" />
          <Animated.View className="ml-2" style={{ opacity: locationOpacity }}>
            <Text className="text-sm font-outfit text-textprimary">Delivery to</Text>
            <Text className="text-xs font-outfit text-textsecondary" numberOfLines={1}>
              {currentLocation?.address || 'Select Location'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
        
        <IconButton
          icon="account"
          size={24}
          onPress={() => safeNavigation('/screens/user')}
        />
      </View>

      <View className="flex-row items-center bg-light rounded-3xl px-4 py-2">
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#666"
          className="mr-2"
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for tiffin services..."
          className="flex-1 text-base font-outfit text-textprimary"
          returnKeyType="search"
        />
        {searchQuery ? (
          <IconButton
            icon="close"
            size={20}
            onPress={() => setSearchQuery('')}
          />
        ) : (
          <IconButton
            icon="microphone"
            size={20}
            onPress={() => {}}
          />
        )}
      </View>
    </Animated.View>
  );
}; 