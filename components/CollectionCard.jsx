import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '@/styles/Collection';

export default function CollectionCard({ collection, onPress }) {
  const renderInfo = () => {
    switch (collection.type) {
      case 'tiffin':
      case 'dining':
        return (
          <Text style={styles.collectionInfo}>
            {collection.dishes} dishes • {collection.restaurants} restaurants
          </Text>
        );
      case 'events':
        return (
          <Text style={styles.collectionInfo}>
            <MaterialCommunityIcons name="calendar" size={14} color="#666" />
            {' '}{collection.date} • {collection.location}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(collection)} activeOpacity={0.7}>
      <View style={styles.collectionCard}>
        <Image 
          source={collection.image || require('@/assets/images/placeholder.png')} 
          style={styles.collectionImage}
        />
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{collection.title}</Text>
          <Text style={styles.collectionInfo}>{collection.description}</Text>
          {renderInfo()}
        </View>

        {collection.featured && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
