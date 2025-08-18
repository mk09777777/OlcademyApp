import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function TopBar() {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  return (
    <View style={styles.topBar}>
      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={24} color="#E41E3F" />
        <View style={styles.addressContainer}>
          <Text style={styles.locationLabel}>Location</Text>
          <TouchableOpacity style={styles.addressButton}>
            <Text style={styles.address} numberOfLines={1}>
              123 Main Street, City, Country
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => safeNavigation('/screens/User')}
      >
        <MaterialIcons name="person" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

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