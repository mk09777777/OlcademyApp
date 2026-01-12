import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { normalizeImageSource } from '@/utils/eventUtils';

const placeholderImage = require('@/assets/images/placeholder.png');

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return null;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

export default function EventCard({ event, onPress }) {
  const coverImage = normalizeImageSource(event.image || event.bannerImage || event.firmImage, placeholderImage);
  const primaryPrice = formatCurrency(event.pricing?.general ?? event.price);
  const attendeeLabel = event.attendees ? `${event.attendees} attending` : null;
  const dateLabel = event.dateLabel || event.date;
  const timeLabel = event.startTime || event.time || event.startTimeLabel;
  const eventDateLabel = dateLabel ? `${dateLabel}${timeLabel ? ` • ${timeLabel}` : ''}` : null;
  const locationLabel = event.location || event.venue || event.firmName;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={styles.firmCard}>
        <Image
          source={coverImage}
          style={styles.firmImage}
        />
        <View className="p-4">
          <View>
            <Text style={styles.firmName}>{event.title}</Text>
            {event.firmName ? (
              <Text style={styles.firmType}>{event.firmName}</Text>
            ) : null}
            {eventDateLabel ? (
              <Text style={styles.collectionInfo}>
                <MaterialCommunityIcons name="calendar" size={14} color="#666" />
                {` ${eventDateLabel}`}
              </Text>
            ) : null}
            {locationLabel ? (
              <Text style={styles.collectionInfo}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                {` ${locationLabel}`}
              </Text>
            ) : null}
          </View>

          <View style={styles.ratingContainer}>
            {primaryPrice ? (
              <Text style={styles.rating}>{primaryPrice}</Text>
            ) : null}
            {attendeeLabel ? (
              <Text style={styles.reviews}>{attendeeLabel}</Text>
            ) : null}
          </View>
        </View>

        {event.featured && (
          <View className="absolute top-2 right-2 bg-orange-500 px-2 py-1 rounded">
            <Text className="text-xs text-white font-outfit-bold">Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
