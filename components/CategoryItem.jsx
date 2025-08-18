import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/tiffinstyle';

export const CategoryItem = ({ 
  category, 
  isSelected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        isSelected && styles.categoryItemSelected
      ]}
      onPress={() => onSelect(category.id)}
    >
      <MaterialCommunityIcons
        name={category?.icon || 'help-circle'}
        size={24}
        color={isSelected ? '#FF4500' : '#666'}
        style={styles.categoryIcon}
      />
      <Text
        style={[
          styles.categoryText,
          isSelected && styles.categoryTextSelected
        ]}
      >
        {category?.name || 'Category'}
      </Text>
    </TouchableOpacity>
  );
}; 