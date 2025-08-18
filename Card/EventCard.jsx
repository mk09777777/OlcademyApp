import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/EventPage';

const EventCard = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      {/* Ensure event.image is a valid URI or use a default fallback */}
      <Image 
        source={event.image} 
        style={styles.eventImage} 
      />
      
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title || "Untitled Event"}</Text>

        <View style={styles.eventInfo}>
          <MaterialIcons name="calendar-today" size={16} color="#666" />
          <Text style={styles.eventInfoText}>
            {event.date ? new Date(event.date).toDateString() : "Date not available"}
          </Text>
        </View>

        <View style={styles.eventInfo}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.eventInfoText}>
            {event.startTime && event.endTime 
              ? `${event.startTime} - ${event.endTime}` 
              : "Time not set"}
          </Text>
        </View>

        <View style={styles.eventInfo}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.eventInfoText}>{event.location || "Location not specified"}</Text>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.attendeeInfo}>
            <MaterialIcons name="people" size={16} color="#666" />
            <Text style={styles.attendeeCount}>
              {event.attendees ? `${event.attendees} attending` : "No attendees yet"}
            </Text>
          </View>

          {/* Ensure "View Details" button triggers `onPress` */}
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
