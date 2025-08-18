import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import styles from '../styles/EventCard';
import { colors } from '../styles/Colors';

const EventCard = ({ event }) => {
  return (
    <View style={[styles.container, layout.shadow]}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.price}>${event.price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={20} color={colors.darkGray} />
          <Text style={styles.infoText}>{event.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={20} color={colors.darkGray} />
          <Text style={styles.infoText}>{event.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={20} color={colors.darkGray} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Users size={20} color={colors.darkGray} />
          <Text style={styles.infoText}>{event.attendees} attendees</Text>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.tags}>
          {event.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventCard;
