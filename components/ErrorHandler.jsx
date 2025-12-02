import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ErrorHandler = ({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  message = "Unable to load data. Please check your connection and try again.",
  showRetry = true,
  style = {}
}) => {
  if (!error) return null;

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white" style={style}>
      <Image
        source={require('@/assets/images/error1.png')}
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />
      <Text className="text-lg font-outfit-bold text-textprimary text-center mb-2">
        {title}
      </Text>
      <Text className="text-base font-outfit text-textsecondary text-center mb-6 px-4">
        {message}
      </Text>
      {showRetry && onRetry && (
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={20} color="white" />
          <Text className="text-white font-outfit-medium text-base ml-2">
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorHandler;