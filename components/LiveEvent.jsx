import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import styles from '../styles/LiveEvent';
import { useSafeNavigation } from '@/hooks/navigationPage';

const LiveEventSection = () => {
  const { safeNavigation } = useSafeNavigation();

  const LiveEventItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.section}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={Colors.textLight}
        />
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={Colors.textLight}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Event</Text>
      </View>

      <LiveEventItem
        icon="calendar-outline"
        title="Live Event"
        chevron
        onPress={() => safeNavigation('/screens/LiveEventPage')}
      />

      <LiveEventItem
        icon="chat-outline"
        title="Live Event help"
        chevron
        onPress={() => console.log('Live Event help pressed')}
      />
    </View>
  );
};

export default LiveEventSection;
