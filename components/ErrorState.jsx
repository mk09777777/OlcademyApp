import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ErrorState = ({ message, onRetry }) => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4B3A" />
      <Text className="text-base text-textsecondary text-center my-4 font-outfit">{message}</Text>
      {onRetry ? (
        <Button mode="contained" onPress={onRetry} className="mt-4 bg-primary">
          Retry
        </Button>
      ) : (
        <Button 
          mode="contained" 
          onPress={() => router.replace('/home')}
          className="mt-4 bg-primary"
        >
          Return Home
        </Button>
      )}
    </View>
  );
};

export default ErrorState;
