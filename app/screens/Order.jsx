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
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#f8f8f8' }
   * ordersList: { padding: 16 }
   * orderCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }
   * restaurantSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }
   * restaurantInfo: { flexDirection: 'row', flex: 1 }
   * restaurantImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 }
   * restaurantDetails: { flex: 1 }
   * restaurantName: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: '600', color: '#333', marginBottom: 4 }
   * location: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666' }
   * amount: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: '600', color: '#333', marginLeft: 8 }
   * divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 }
   * sectionLabel: { fontSize: 12, fontFamily: 'outfit', fontWeight: '500', color: '#666', marginBottom: 8 }
   * itemsSection: { marginBottom: 16 }
   * itemText: { fontSize: 14, fontFamily: 'outfit-medium', color: '#333', marginBottom: 4 }
   * orderInfoSection: { marginBottom: 16 }
   * orderDateTime: { fontSize: 14, fontFamily: 'outfit-medium', color: '#333' }
   * orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
   * statusText: { fontSize: 14, fontFamily: 'outfit-medium', fontWeight: '500' }
   * rejectedStatus: { color: '#e23744' }
   * repeatButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 }
   * repeatButtonText: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666', marginLeft: 4 }
   * tabContainer: { flexDirection: 'row', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }
   * tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' }
   * activeTab: { borderBottomColor: '#fc8019' }
   * tabText: { fontSize: 16, fontFamily: 'outfit-medium', color: '#666' }
   * activeTabText: { color: '#fc8019', fontWeight: '600', fontFamily: 'outfit-medium' }
   */
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting tittle ="Your Order"/>
      
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

