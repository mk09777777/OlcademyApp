import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { router } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
const TableSection = () => {
  const { safeNavigation } = useSafeNavigation();
  const TableItem = ({ icon, title, chevron, onPress }) => (
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dining</Text>
      </View>

      <TableItem
        icon="chair"
        title="Your booking"
        chevron
        onPress={() => safeNavigation('/screens/DiningBooking')}
      />
 <TableItem
        icon="trending-up"
        title="Your dining transactions"
        chevron
        onPress={() => safeNavigation('/screens/DiningTransactions')}
      />
      <TableItem
        icon="chat"
        title="Dining booking help"
        chevron
        onPress={() => safeNavigation('/screens/DiningBookingHelp')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: 10,
  },
  header: {
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  chevron: {
    marginLeft: 'auto',
  },
});

export default TableSection;