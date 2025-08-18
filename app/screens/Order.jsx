import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TakeawayOrdersScreen from './TakeWayOrderScreen';
import TiffinOrdersScreen from './TiffinOrderScreen';
import { Ionicons } from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';
import { BadgeX } from 'lucide-react-native';
const Tab = createMaterialTopTabNavigator();

export default function OrderScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <BackRouting tittle ="Your Order"/>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View> */}
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#fc8019',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#fc8019' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: '500', textTransform: 'none' },
          tabBarStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
        }}
      >
        <Tab.Screen 
          name="TakeawayOrders" 
          component={TakeawayOrdersScreen}
          options={{ 
            tabBarLabel: 'Takeaway',
            tabBarIcon: ({ color }) => <Ionicons name="restaurant-outline" size={20} color={color} />,
          }}
        />
        <Tab.Screen 
          name="TiffinOrders" 
          component={TiffinOrdersScreen}
          options={{ 
            tabBarLabel: 'Tiffin',
            tabBarIcon: ({ color }) => <Ionicons name="briefcase-outline" size={20} color={color} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});