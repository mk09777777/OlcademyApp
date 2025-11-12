import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const CategoryItem = ({ 
  category, 
  isSelected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-3 m-1 rounded-lg border ${
        isSelected ? 'bg-orange-50 border-orange-500' : 'bg-white border-gray-200'
      }`}
      onPress={() => onSelect(category.id)}
    >
      <MaterialCommunityIcons
        name={category?.icon || 'help-circle'}
        size={24}
        color={isSelected ? '#FF4500' : '#666'}
        className="mr-2"
      />
      <Text
        className={`text-sm font-outfit ${
          isSelected ? 'color-orange-600 font-outfit-bold' : 'color-gray-700'
        }`}
      >
        {category?.name || 'Category'}
      </Text>
    </TouchableOpacity>
  );
}; 