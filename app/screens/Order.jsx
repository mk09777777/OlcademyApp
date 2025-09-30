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
            tabBarInactiveTintColor: '#02757A',
            tabBarPressColor: 'transparent',
            tabBarShowIcon: true,
            tabBarIconStyle: {
              marginRight: 8,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'none',
              fontFamily: 'outfit-medium',
              marginLeft: 0,
            },
            tabBarItemStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarStyle: {
              backgroundColor: '#d9e9e9ff',
              borderRadius: 30,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#02757A',
              height: '100%',
              borderRadius: 30,
            },
          }}
        >
          <Tab.Screen
            name="TakeawayOrders"
            component={TakeawayOrdersScreen}
            options={{
              tabBarLabel: 'Takeaway',
              tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={20} color={color} />,
            }}
          />
          <Tab.Screen
            name="TiffinOrders"
            component={TiffinOrdersScreen}
            options={{
              tabBarLabel: 'Tiffin',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-takeout-box" size={20} color={color} />,
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}