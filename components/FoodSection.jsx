import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import styles from '../styles/FoodSection';
import { router } from 'expo-router';

const FoodSection = () => {
  const FoodItem = ({ icon, title, chevron, onPress }) => (
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
        <Text style={styles.headerTitle}>Food Orders</Text>
      </View>

      <FoodItem
        icon="shopping-bag"
        title="Your Orders"
        chevron
        onPress={() => router.push('/screens/Order')}
      />

      <FoodItem
        icon="favorite-border"
        title="Favorite Orders"
        chevron
        onPress={() => router.push('/screens/FavoriteOrders')}
      />
      <FoodItem
        icon="location-on"
        title="Your Address"
        chevron
        onPress={() => router.push('/screens/Address')}
      />

      <FoodItem
        icon="chat"
        title="Online Ordering Help"
        chevron
        onPress={() => router.push('/screens/OrderSupportChat')}
      />
    </View>
  );
};

export default FoodSection;