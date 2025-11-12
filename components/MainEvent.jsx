import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const MainTabs = ({ activeTab, onTabChange }) => (
  <View className="flex-row bg-gray-100 rounded-lg p-1 mx-4 mb-4">
    {['all','upcoming','active', 'past'].map((tab) => (
      <TouchableOpacity
        key={tab}
        className={`flex-1 py-2 px-3 rounded-md items-center ${
          activeTab === tab ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
        onPress={() => onTabChange(tab)}
      >
        <Text className={`text-sm font-outfit ${
          activeTab === tab ? 'color-primary font-outfit-bold' : 'color-gray-600'
        }`}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default MainTabs;