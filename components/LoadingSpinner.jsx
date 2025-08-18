import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../styles/tiffinstyle';
import styles from '../styles/tiffinstyle';

const LoadingSpinner = ({
  message = 'Loading...',
  overlay = false
}) => {
  if (overlay) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingTitle}>{message}</Text>
          <Text style={styles.loadingSubtext}>Please wait</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

export default LoadingSpinner;
