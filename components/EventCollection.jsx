import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collections } from '@/Data/EventCollection';
import { useFirm } from '@/context/FirmContext';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import styles from '@/styles/Collection';
import BackRouting from '@/components/BackRouting';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function EventCollection() {
  const { collectionId } = useGlobalSearchParams();
  const router = useRouter();
  const { firms, loading: firmsLoading } = useFirm();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { safeNavigation } = useSafeNavigation();
  const collection = collections.find(c => c.id === collectionId);

  useEffect(() => {
    if (firms) {
      const filtered = firms.filter(firm => {
        const matchesSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase());
        const hasEvents = firm.events?.length > 0;
        return matchesSearch && hasEvents;
      }).flatMap(firm => 
        firm.events.map(event => ({
          ...event,
          firmId: firm.id,
          firmName: firm.name,
          firmImage: firm.image
        }))
      );
      setFilteredEvents(filtered);
    }
  }, [firms, searchQuery]);

  if (!collection) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={48} 
          color="#666" 
          style={styles.emptyStateIcon}
        />
        <Text style={styles.emptyStateTitle}>Collection Not Found</Text>
        <Text style={styles.emptyStateMessage}>
          The collection you're looking for doesn't exist or has been removed.
        </Text>
      </View>
    );
  }

  if (firmsLoading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" />
        <Text style={styles.emptyStateMessage}>Loading events...</Text>
      </View>
    );
  }

  const renderEventCard = ({ item: event }) => (
    <EventCard
      event={event}
      onPress={() => safeNavigation({
        pathname: '/screens/EventDetails',
        params: { 
          eventId: event.id,
          firmId: event.firmId
        }
      })}
    />
  );

  return (
    <View style={styles.container}>
      <BackRouting tittle= "Event Collection"/>
      <View style={styles.collectionCard}>
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{collection.title}</Text>
          <Text style={styles.collectionInfo}>{collection.description}</Text>
          {collection.date && (
            <Text style={styles.collectionInfo}>
              {collection.date} • {collection.location}
            </Text>
          )}
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search events..."
      />

      {filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="calendar-blank" 
            size={48} 
            color="#666" 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Events Found</Text>
          <Text style={styles.emptyStateMessage}>
            Try adjusting your search or check back later for new events.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.firmList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}