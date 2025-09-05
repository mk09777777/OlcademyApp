import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Ionicons name='location' size={24} style={styles.locationIcon} />
      <TouchableOpacity
        style={styles.locationInfo}
        onPress={() => safeNavigation('/screens/SelectLocation')}
      >
        <View>
          <Text style={styles.cityText}>
            { location.city || 'Select Location'}
          </Text>
          <Text style={styles.stateText}>{location.state || ''}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  locationIcon: {
    paddingTop: 6,
    paddingRight: 7,
    color: '#e23845',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  stateText: {
    fontSize: 12,
    color: '#555',
  },
});
