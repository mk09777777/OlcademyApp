import React from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/tiffinstyle';
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
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.locationContainer}
          // onPress={() => safeNavigation('/screens/LocationSelect')}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="#FF4500" />
          <Animated.View style={{ opacity: locationOpacity }}>
            <Text style={styles.locationTitle}>Delivery to</Text>
            <Text style={styles.locationSubtitle} numberOfLines={1}>
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

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for tiffin services..."
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery ? (
          <IconButton
            icon="close"
            size={20}
            onPress={() => setSearchQuery('')}
            style={styles.clearSearch}
          />
        ) : (
          <IconButton
            icon="microphone"
            size={20}
            onPress={() => {}}
            style={styles.voiceSearchIcon}
          />
        )}
      </View>
    </Animated.View>
  );
}; 