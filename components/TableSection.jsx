import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { useSafeNavigation } from '@/hooks/navigationPage';

const TableSection = () => {
  const { safeNavigation } = useSafeNavigation();

  const TableItem = ({ icon, title, chevron, onPress }) => (
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
        <Text style={styles.headerTitle}>Dining</Text>
      </View>

      <TableItem
        icon="chair"
        title="Your booking"
        chevron
        onPress={() => safeNavigation('/screens/DiningBooking')}
      />
      <TableItem
        icon="file-document-outline"
        title="Your dining transactions"
        chevron
        onPress={() => safeNavigation('/screens/DiningTransactions')}
      />
      <TableItem
        icon="chat-outline"
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
    fontSize: 18,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
