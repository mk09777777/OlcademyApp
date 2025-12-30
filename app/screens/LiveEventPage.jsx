import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, FlatList } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import MainTabs from '../../components/MainEvent';
import EventCard from '../../Card/EventCard';
import EventDetailsModal from '../../Model/EventModal';
import { eventCategories } from '@/Data/EventData';
import BackRouting from '@/components/BackRouting';
import { fetchEvents } from '@/services/eventService';
const EventsTabView = () => {
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#F8F8F8' }
   * loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
   * loadingText: { marginTop: 10, fontSize: 16, fontFamily: 'outfit-medium', color: '#555' }
   * listContainer: { padding: 16 }
   * modalContainer: { flex: 1, backgroundColor: '#FFFFFF' }
   * scrollContainer: { flex: 1 }
   * mainTabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' }
   * mainTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20, marginHorizontal: 4 }
   * activeMainTab: { backgroundColor: '#E91E63' }
   * mainTabText: { fontSize: 15, fontFamily: 'outfit-medium', fontWeight: '600', color: '#666666' }
   * activeMainTabText: { color: '#FFFFFF' }
   * eventCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
   * eventImage: { width: '100%', height: 160 }
   * eventContent: { padding: 16 }
   * eventTitle: { fontSize: 18, fontFamily: 'outfit-bold', fontWeight: 'bold', color: '#333333', marginBottom: 8 }
   * eventInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 }
   * eventInfoText: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666666', marginLeft: 8 }
   * eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEEEEE' }
   */
  const [activeMainTab, setActiveMainTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useGlobalSearchParams();
  const focusCategoryParam = params?.focusCategory;
  const resolvedFocusCategory = Array.isArray(focusCategoryParam)
    ? focusCategoryParam[0]
    : focusCategoryParam;
  const activeCategoryKey = resolvedFocusCategory && resolvedFocusCategory !== 'all'
    ? resolvedFocusCategory
    : null;
  const activeCategoryMeta = activeCategoryKey
    ? eventCategories.find((category) => category.key === activeCategoryKey)
    : null;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchEvents()
      .then((fetched) => {
        if (isMounted) {
          setEvents(fetched || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);
  const now = new Date();
  const filterEvents = () => {
    if (!Array.isArray(events)) return [];

    return events.filter(event => {
      const eventDate = new Date(event.dateTime); // Ensure date is in correct format
      if (activeCategoryKey && event.category !== activeCategoryKey) {
        return false;
      }

      if (activeMainTab === 'all') return true;
      if (activeMainTab === 'active') return event.status === 'active';
      if (activeMainTab === 'past') return eventDate < now;  // Events in the past
      if (activeMainTab === 'upcoming') return eventDate > now; // Events in the future

      return false;
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <BackRouting tittle="Live Event"/>
      {/* ✅ Updated MainTabs */}
      <MainTabs activeTab={activeMainTab} onTabChange={setActiveMainTab} />
      {activeCategoryMeta ? (
        <View className="px-4 py-2">
          <Text className="text-xs font-outfit text-textsecondary">
            Showing {activeCategoryMeta.title}
          </Text>
        </View>
      ) : null}
      
      {/* Show loading indicator when fetching data */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E91E63" />
          <Text className="mt-2.5 text-base text-gray-600" style={{ fontFamily: 'outfit-medium' }}>Loading events...</Text>
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
          contentContainerStyle={{ padding: 16 }}
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
