import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
// import styles from '../styles/tiffinstyle';

export const SectionHeader = ({
  title,
  subtitle,
  onViewAll
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
        )}
      </View>
      {onViewAll && (
        <Button
          onPress={onViewAll}
          className=""
        >
          <Text className="text-blue-600 font-medium">View All</Text>
        </Button>
      )}
    </View>
  );
}; 