import React, { useState } from 'react';
import { 
  View, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  Image,
  Linking
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from '../styles/EventPage';
import { normalizeImageSource } from '@/utils/eventUtils';

const placeholderImage = require('@/assets/images/placeholder.png');

const EventDetailsModal = ({ event, visible, onClose }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!event) return null;

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleOpenMap = () => {
    // Implement map opening functionality
    Linking.openURL(`https://maps.google.com/?q=${event.location}`);
  };

  const handleJoinLiveStream = () => {
    // Implement live stream joining functionality
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const heroImage = normalizeImageSource(event.bannerImage || event.image, placeholderImage);
  const dateLabel = event.dateLabel || event.date;
  const timeWindow = event.startTime && event.endTime
    ? `${event.startTime} - ${event.endTime}`
    : event.startTime || event.endTime;
  const attendeesLabel = event.attendees ? `${event.attendees} people attending` : 'Attendance info coming soon';
  const eventTypeLabel = String(event.type || event.category || 'event').replace(/_/g, ' ');

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Banner Section */}
          <View style={styles.bannerContainer}>
            <Image source={heroImage} style={styles.bannerImage} />
            <View style={styles.overlay}>
              <View style={styles.headerContent}>
                {event.isLive && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                )}
                <Text style={styles.modalEventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {dateLabel}
                  {timeWindow ? ` • ${timeWindow}` : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.registerButton, isRegistered && styles.registeredButton]}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>
                {isRegistered ? 'Registered' : 'Register Now'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <FontAwesome
                name={liked ? 'heart' : 'heart-o'}
                size={24}
                color={liked ? '#E91E63' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialIcons name="share" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Event Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <Text style={styles.sectionText}>{event.description}</Text>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={24} color="#E91E63" />
              <Text style={styles.locationText}>{event.location || event.venue}</Text>
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </TouchableOpacity>
            {event.isLive && (
              <TouchableOpacity 
                style={styles.liveStreamButton}
                onPress={handleJoinLiveStream}
              >
                <MaterialIcons 
                  name="videocam" 
                  size={24} 
                  color="#FFFFFF" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.liveStreamButtonText}>Join Live Stream</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Performers Section */}
          {event.performers && event.performers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performers</Text>
              {event.performers.map((performer) => (
                <View key={performer.id} style={styles.performerItem}>
                  <View style={styles.performerAvatar}>
                    <Text style={styles.performerInitials}>
                      {getInitials(performer.name)}
                    </Text>
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerName}>{performer.name}</Text>
                    <Text style={styles.performerGenre}>{performer.genre}</Text>
                  </View>
                  <TouchableOpacity style={styles.performerAction}>
                    <MaterialIcons name="more-vert" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Schedule Section */}
          {event.schedule && event.schedule.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              {event.schedule.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    {index !== event.schedule.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.scheduleContent}>
                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                    <Text style={styles.scheduleDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Additional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.infoRow}>
              <MaterialIcons 
                name="people" 
                size={24} 
                color="#666" 
                style={styles.infoIcon} 
              />
              <Text style={styles.infoText}>
                {attendeesLabel}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons 
                name="category" 
                size={24} 
                color="#666" 
                style={styles.infoIcon} 
              />
              <Text style={styles.infoText}>
                Event Type: {eventTypeLabel.charAt(0).toUpperCase() + eventTypeLabel.slice(1)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EventDetailsModal;