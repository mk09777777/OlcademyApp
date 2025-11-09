import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import styles from '../styles/FoodSection';
import { router } from 'expo-router';
import { useSafeNavigation } from "@/hooks/navigationPage";


const FoodSection = () => {
const { safeNavigation } = useSafeNavigation();
  const FoodItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.section}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={Colors.textLight} />
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
        <Text style={styles.headerTitle}>Food Orders</Text>
      </View>

      <FoodItem
        icon="shopping-outline"
        title="Your Orders"
        chevron
        onPress={() => safeNavigation('/screens/Order')}
      />

      <FoodItem
        icon="heart-outline"
        title="Favorite Orders"
        chevron
        onPress={() => safeNavigation('/screens/FavoriteOrders')}
      />

      <FoodItem
        icon="map-marker-outline"
        title="Your Address"
        chevron
        onPress={() => safeNavigation('/screens/Address')}
      />

      <FoodItem
        icon="chat-outline"
        title="Online Ordering Help"
        chevron
        onPress={() => safeNavigation('/screens/OrderSupportChat')}
      />
    </View>
  );
};

export default FoodSection;
