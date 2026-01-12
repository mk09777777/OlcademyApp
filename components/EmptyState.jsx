import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';

export const EmptyState = ({
  image,
  title,
  description,
  buttonText,
  onButtonPress
}) => {
  return (
    <View className="flex-1 justify-center items-center p-8">
      {image && (
        <Image
          source={image}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />
      )}
      <Text className="text-xl font-outfit-bold text-textprimary text-center mb-3">{title}</Text>
      <Text className="text-base font-outfit text-textsecondary text-center mb-6">{description}</Text>
      {buttonText && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          className="bg-primary"
        >
          <Text className="text-white font-outfit-bold">{buttonText}</Text>
        </Button>
      )}
    </View>
  );
}; 