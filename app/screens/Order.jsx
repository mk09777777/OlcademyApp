import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TakeawayOrdersScreen from './TakeWayOrderScreen';
import TiffinOrdersScreen from './TiffinOrderScreen';
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';
import { BadgeX } from 'lucide-react-native';
const Tab = createMaterialTopTabNavigator();

export default function OrderScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting tittle ="Your Order"/>
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FF002E',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#FF002E' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: '500', textTransform: 'none' },
          tabBarStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
        }}
      >
        <Tab.Screen 
          name="TakeawayOrders" 
          component={TakeawayOrdersScreen}
          options={{ 
            tabBarLabel: 'Takeaway',
            tabBarIcon: ({ color }) => <Ionicons name="fast-food-outline" size={24} color={color} />,
          }}
        />
        <Tab.Screen 
          name="TiffinOrders" 
          component={TiffinOrdersScreen}
          options={{ 
            tabBarLabel: 'Tiffin',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-takeout-box-outline" size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

