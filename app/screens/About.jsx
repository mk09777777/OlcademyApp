import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import styles from '../../styles/About';
import { useSafeNavigation } from '@/hooks/navigationPage';
const About = () => {
  const{safeNavigation} = useSafeNavigation();
  return (
    <View style={styles.container}>
      {/* Terms of Service */}
      <TouchableOpacity style={styles.item} onPress={() => safeNavigation('/screens/TermsofService')}>
        <Text style={styles.itemText}>Terms of Service</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>

      {/* App Version (non-clickable, no chevron) */}
      <View style={styles.itemNoChevron}>
        <View>
          <Text style={styles.subText}>App version</Text>
          <Text style={styles.versionText}>v18.9.0 Live</Text>
        </View>
      </View>

      {/* Open Source Libraries */}
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Open Source Libraries</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>

      {/* Licenses and Registrations */}
      <TouchableOpacity style={styles.item} onPress={() => safeNavigation('/screens/LicenseScreen')}>
        <Text style={styles.itemText}>Licenses and Registrations</Text>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );
};


export default About;
