import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import styles from '../styles/Collection';

const CollectionCard = ({ collection, onPress }) => (
  <View>
  <TouchableOpacity
    style={styles.collectionCard}
    onPress={() => onPress(collection)}
    activeOpacity={0.7}
  >
    <Image source={collection.image} style={styles.collectionImage} />
    <Text style={styles.collectionTitle}>{collection.title}</Text>
    {'dishes' in collection && (
      <Text style={styles.collectionInfo}>
        {collection.dishes} dish{collection.dishes !== 1 ? 'es' : ''} • {collection.restaurants} restaurant{collection.restaurants !== 1 ? 's' : ''}
      </Text>
    )}
    {'date' in collection && (
      <Text style={styles.collectionInfo}>
        📅 {collection.date} • 📍 {collection.location}
      </Text>
    )}
  </TouchableOpacity>
  </View>
);

export default CollectionCard;
