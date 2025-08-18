import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '@/styles/Collection';

export default function EventCard({ event, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.firmCard}>
        <Image 
          source={event.firmImage || require('@/assets/images/placeholder.png')} 
          style={styles.firmImage}
        />
        <View style={styles.firmContent}>
          <View>
            <Text style={styles.firmName}>{event.title}</Text>
            <Text style={styles.firmType}>{event.firmName}</Text>
            <Text style={styles.collectionInfo}>
              <MaterialCommunityIcons name="calendar" size={14} color="#666" />
              {' '}{event.date} • {event.time}
            </Text>
            <Text style={styles.collectionInfo}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
              {' '}{event.location}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            {event.price && (
              <Text style={styles.rating}>₹{event.price}</Text>
            )}
            {event.attendees && (
              <Text style={styles.reviews}>
                {event.attendees} attending
              </Text>
            )}
          </View>
        </View>

        {event.featured && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
