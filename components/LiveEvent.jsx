import React from 'react';
import { View, Text,  TouchableOpacity } from 'react-native';
import { MaterialIcons, } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { router } from 'expo-router';
import styles from '../styles/LiveEvent';
import { useSafeNavigation } from '@/hooks/navigationPage';
const LiveEventSection = () => {
  const LiveEventItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.section}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={Colors.textLight} />
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {chevron && <MaterialIcons name="chevron-right" size={24} color={Colors.textLight} style={styles.chevron} />}
    </TouchableOpacity>
  );
 const { safeNavigation } = useSafeNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Event</Text>
      </View>
      <LiveEventItem
        icon="event"
        title="Live Event"
        chevron
        onPress={() => safeNavigation('/screens/LiveEventPage')}
      />
       <LiveEventItem
        icon="chat"
        title="Live Event help"
        chevron
        onPress={() =>console.log('jbsdsf')}
      />
    </View>
  );
};
export default LiveEventSection;