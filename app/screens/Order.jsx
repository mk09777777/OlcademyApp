import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TakeawayOrdersScreen from './TakeWayOrderScreen';
import TiffinOrdersScreen from './TiffinOrderScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';

const Tab = createMaterialTopTabNavigator();

export default function OrderScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting tittle="Your Order" />

      <View className="flex-1 px-5 py-3">
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#FF002E',
            tabBarPressColor: 'transparent',
            tabBarIconPosition: 'left', 
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'none',
              fontFamily: 'outfit-medium',
              flexDirection: 'row',
            },
            tabBarStyle: {
              backgroundColor: '#feebee',
              borderRadius: 30,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#FF002E',
              height: '100%',
              borderRadius: 30,
            },
          }}
        >
          <Tab.Screen
            name="TakeawayOrders"
            component={TakeawayOrdersScreen}
            options={{
              tabBarLabel: ({ color }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="fast-food" size={20} color={color} style={{ marginRight: 6 }} />
                  <Text style={{ color, fontSize: 14, fontWeight: '600', fontFamily: 'outfit-medium' }}>Takeaway</Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="TiffinOrders"
            component={TiffinOrdersScreen}
            options={{
              tabBarLabel: ({ color }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="food-takeout-box" size={20} color={color} style={{ marginRight: 6 }} />
                  <Text style={{ color, fontSize: 14, fontWeight: '600', fontFamily: 'outfit-medium' }}>Tiffin</Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}