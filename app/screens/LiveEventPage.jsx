import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, FlatList } from 'react-native';
import MainTabs from '../../components/MainEvent';
import EventCard from '../../Card/EventCard';
import EventDetailsModal from '../../Model/EventModal';
import { mockEvents } from '../../Data/EventData';
import styles from '../../styles/EventPage';
import BackRouting from '@/components/BackRouting';
const EventsTabView = () => {
  const [activeMainTab, setActiveMainTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");

        // Simulating an API call with a delay
        setTimeout(() => {
          console.log("Mock Events:", mockEvents);
          setEvents(mockEvents || []); // Ensure it sets an array
          setLoading(false);
        }, 1010);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]); // Fallback to an empty array on error
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  const now = new Date();
  const filterEvents = () => {
    if (!Array.isArray(events)) return [];

    return events.filter(event => {
      const eventDate = new Date(event.dateTime); // Ensure date is in correct format

      if (activeMainTab === 'all') return true;
      if (activeMainTab === 'active') return event.status === 'active';
      if (activeMainTab === 'past') return eventDate < now;  // Events in the past
      if (activeMainTab === 'upcoming') return eventDate > now; // Events in the future

      return false;
    });
  };

  return (
    <View style={styles.container}>
      <BackRouting tittle="Live Event"/>
      {/* ✅ Updated MainTabs */}
      <MainTabs activeTab={activeMainTab} onTabChange={setActiveMainTab} />
      
      {/* Show loading indicator when fetching data */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          data={filterEvents()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => {
                setSelectedEvent(item);
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={item => item.id.toString()} // Ensure key is a string
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default EventsTabView;
