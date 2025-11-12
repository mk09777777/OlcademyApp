import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collections } from '@/Data/EventCollection';
import { useFirm } from '@/context/FirmContext';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
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

  if (firmsLoading) {
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
          firmId: event.firmId
        }
      })}
    />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <BackRouting tittle= "Event Collection"/>
      <View className="bg-white rounded-xl shadow-sm m-4 p-4">
        <View>
          <Text className="text-lg font-outfit-bold color-gray-900">{collection.title}</Text>
          <Text className="text-sm color-gray-600 font-outfit mt-1">{collection.description}</Text>
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