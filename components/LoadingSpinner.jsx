import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

const LoadingSpinner = ({
  message = 'Loading...',
  overlay = false
}) => {
  if (overlay) {
    return (
      <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
        <View className="bg-white p-6 rounded-lg items-center">
          <ActivityIndicator size="large" color="#FF002E" />
          <Text className="text-lg font-outfit-bold text-textprimary mt-3">{message}</Text>
          <Text className="text-sm font-outfit text-textsecondary mt-1">Please wait</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#FF002E" />
      <Text className="text-base font-outfit text-textsecondary mt-3">{message}</Text>
    </View>
  );
};

export default LoadingSpinner;
