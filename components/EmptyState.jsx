import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import styles from '../styles/tiffinstyle';

export const EmptyState = ({
  image,
  title,
  description,
  buttonText,
  onButtonPress
}) => {
  return (
    <View style={styles.emptyStateContainer}>
      {image && (
        <Image
          source={image}
          style={styles.emptyStateImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
      {buttonText && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.emptyStateButton}
        >
          <Text style={styles.emptyStateButtonText}>{buttonText}</Text>
        </Button>
      )}
    </View>
  );
}; 