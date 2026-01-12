import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collections } from '@/Data/EventCollection';
import { useFirm } from '@/context/FirmContext';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import BackRouting from '@/components/BackRouting';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { fetchEvents } from '@/services/eventService';
export default function EventCollection() {
  const { collectionId } = useGlobalSearchParams();
  const { firms, loading: firmsLoading } = useFirm();
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteEvents, setRemoteEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const collection = collections.find(c => c.id === collectionId);

  useEffect(() => {
    let isMounted = true;

    if (!collection || collection.type !== 'events') {
      setRemoteEvents([]);
      return () => {
        isMounted = false;
      };
    }

    setEventsLoading(true);
    fetchEvents(collection.categoryKey ? { category: collection.categoryKey } : {})
      .then((events) => {
        if (isMounted) {
          setRemoteEvents(events || []);
        }
      })
      .finally(() => {
        if (isMounted) {
          setEventsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [collection]);

  const filteredEvents = useMemo(() => {
    if (!collection) {
      return [];
    }

    const lowerSearch = searchQuery.trim().toLowerCase();

    if (collection.type === 'events') {
      return (remoteEvents || [])
        .filter((event) => {
          if (!lowerSearch) {
            return true;
          }
          const haystack = [event.title, event.city, event.venue, event.location]
            .filter(Boolean)
            .map((value) => value.toLowerCase());
          return haystack.some((value) => value.includes(lowerSearch));
        })
        .map((event) => ({
          ...event,
          firmId: event.id,
          firmName: event.venue ?? event.location ?? event.city,
          firmImage: event.image,
          date: event.dateLabel || event.date,
          time: event.startTime,
          price: event.pricing?.general,
        }));
    }

    if (!firms) {
      return [];
    }

    return firms
      .filter((firm) => {
        const matchesSearch = firm.name.toLowerCase().includes(lowerSearch);
        const hasEvents = firm.events?.length > 0;
        return (!lowerSearch || matchesSearch) && hasEvents;
      })
      .flatMap((firm) =>
        firm.events.map((event) => ({
          ...event,
          firmId: firm.id,
          firmName: firm.name,
          firmImage: firm.image,
        }))
      );
  }, [collection, firms, remoteEvents, searchQuery]);

  if (!collection) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={48} 
          color="#666" 
          className="mb-4"
        />
        <Text className="text-lg font-outfit-bold color-gray-700 mb-2">Collection Not Found</Text>
        <Text className="text-sm color-gray-500 font-outfit text-center">
          The collection you're looking for doesn't exist or has been removed.
        </Text>
      </View>
    );
  }

  if (collection.type === 'events' && eventsLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" />
        <Text className="text-sm color-gray-500 font-outfit text-center mt-4">Loading events...</Text>
      </View>
    );
  }

  if (collection.type !== 'events' && firmsLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" />
        <Text className="text-sm color-gray-500 font-outfit text-center mt-4">Loading events...</Text>
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
        }
      })}
    />
  );

  return (
    <View style={styles.container}>
      <BackRouting title="Event Collection" />
      <View style={styles.collectionCard}>
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{collection.title}</Text>
          <Text style={styles.collectionInfo}>{collection.description}</Text>
          {collection.date && (
            <Text className="text-sm color-gray-600 font-outfit mt-1">
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
        <View className="flex-1 justify-center items-center p-4">
          <MaterialCommunityIcons 
            name="calendar-blank" 
            size={48} 
            color="#666" 
            className="mb-4"
          />
          <Text className="text-lg font-outfit-bold color-gray-700 mb-2">No Events Found</Text>
          <Text className="text-sm color-gray-500 font-outfit text-center">
            Try adjusting your search or check back later for new events.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={item => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}