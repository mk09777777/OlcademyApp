import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import styles from '../styles/QuickSection';
import { router } from 'expo-router';
import BackRouting from './BackRouting';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function QuickActions() {
  const { safeNavigation } = useSafeNavigation();
  return (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.quickActionItem} onPress={() => safeNavigation('/screens/Collection')}>
        <Ionicons name="bookmark-outline" size={24} color={Colors.textLight} />
        <Text>Collections</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionItem} onPress={() => safeNavigation('/screens/Activity')}>
      <View style={styles.viewActivityContainer}>
      <Ionicons name="eye-outline" size={20} color="#000" style={styles.icon} />
        <Text style={styles.viewActivity}>View activity ›</Text>
      </View>
    </TouchableOpacity>
    </View>
  );
}