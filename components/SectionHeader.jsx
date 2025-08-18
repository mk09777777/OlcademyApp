import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import styles from '../styles/tiffinstyle';

export const SectionHeader = ({
  title,
  subtitle,
  onViewAll
}) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        )}
      </View>
      {onViewAll && (
        <Button
          onPress={onViewAll}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </Button>
      )}
    </View>
  );
}; 