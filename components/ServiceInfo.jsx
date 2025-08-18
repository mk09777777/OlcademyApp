import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { IconButton, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export const ServiceInfo = ({ service, isFavorite, onFavoriteToggle }) => {
  if (!service) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${service.name} on our app! They offer amazing tiffin services.`,
        title: service.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{service.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {service.rating.toFixed(1)} ({service.reviewCount} ratings)
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            iconColor={isFavorite ? '#FF4500' : '#000'}
            size={24}
            onPress={onFavoriteToggle}
          />
          <IconButton
            icon="share-variant"
            size={24}
            onPress={handleShare}
          />
        </View>
      </View>

      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.tags}>
        {service.tags.map((tag, index) => (
          <Chip
            key={index}
            style={styles.tag}
            textStyle={styles.tagText}
            mode="outlined"
          >
            {tag}
          </Chip>
        ))}
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{service.deliveryTime}</Text>
        </View>
        {service.isVerified && (
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Verified</Text>
          </View>
        )}
        {service.isPopular && (
          <View style={styles.infoItem}>
            <Ionicons name="trending-up" size={20} color="#FF4500" />
            <Text style={styles.infoText}>Popular</Text>
          </View>
        )}
      </View>

      {service.category && (
        <View style={styles.categoryContainer}>
          <Chip
            icon={service.category.toLowerCase().includes('veg') ? 'leaf' : 'food'}
            style={[
              styles.categoryChip,
              {
                backgroundColor: service.category.toLowerCase().includes('veg')
                  ? '#4CAF50'
                  : '#FF4500',
              },
            ]}
            textStyle={styles.categoryText}
          >
            {service.category}
          </Chip>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: 'transparent',
    borderColor: '#ddd',
  },
  tagText: {
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    color: '#666',
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});