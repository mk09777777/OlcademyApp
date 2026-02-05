import React, { useMemo, useState, useCallback, useEffect, memo } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Internal Components & Data
import SearchBar from "@/components/SearchBar";
import FilterShow from "@/components/FilterShow";
import EventDetailsModal from "../../Model/EventModal"; 

// Hooks & Services
import { useSafeNavigation } from "@/hooks/navigationPage";
import { eventCategories } from "@/Data/EventData";
import { fetchEvents } from "@/services/eventService";
import { normalizeImageSource } from "@/utils/eventUtils";

const { width } = Dimensions.get("window");
const placeholderImage = require("@/assets/images/placeholder.png");

// ------------------------------------------------------------------
// 1. Constants & Configuration
// ------------------------------------------------------------------
const DEFAULT_FILTERS = {
  sortBy: "mostPopular",
  location: null,
  typesOfShow: [],
  timing: "anytime",
  customDate: null,
};

const typeToCategoryMap = {
  Concert: "concert",
  "Stand-up": "comedy",
  Drama: "drama",
  Workshop: "workshop",
  Festival: "festival",
};

// ------------------------------------------------------------------
// 2. Utility Functions (Kept in-file for visibility)
// ------------------------------------------------------------------
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const toDisplayText = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

const formatVenueText = (venue, fallbackLocation) => {
  const locationText = toDisplayText(fallbackLocation);
  if (locationText) return locationText;

  if (!venue) return '';
  if (typeof venue === 'string') return venue;
  if (typeof venue === 'object') {
    const name = toDisplayText(venue.name);
    const address = toDisplayText(venue.address || venue.addressLine);
    const city = toDisplayText(venue.city);
    const segments = [name, address, city].filter((s) => s && s.trim().length);
    return segments.length ? segments.join(', ') : '';
  }
  return '';
};

// ------------------------------------------------------------------
// 3. EventsHeader Sub-Component
// ------------------------------------------------------------------
const EventsHeader = memo(({ 
  safeNavigation, 
  searchQuery, 
  setSearchQuery, 
  featuredEvents, 
  categoriesWithCounts, 
  selectedCategory, 
  handleCategoryPress, 
  filteredCount, 
  getMonth, 
  getDay, 
  setFilterVisible,
  onEventClick // NEW: For opening the modal
}) => {
  return (
    <View className="pb-6">
      <View className="pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-outfit-bold text-textprimary">
            Explore Events
          </Text>
          <TouchableOpacity onPress={() => safeNavigation("/screens/User")}>
            <Ionicons name="person-circle-outline" size={40} color="#02757A" />
          </TouchableOpacity>
        </View>
        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          placeholder="Search events..."
          widthClass="w-full"
          onVoicePress={() => {}}
        />
      </View>

      {/* Featured Events Horizontal Scroll */}
      <View className="mt-6">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">FEATURED</Text>
          <View className="flex-1 h-px bg-primary" />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredEvents}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="w-72 h-48 mr-3" 
              onPress={() => safeNavigation({
              pathname: "/screens/EventDetails",
              params: { eventId: item.id }
            })} // Navigate to EventDetails screen
            >
              <ImageBackground 
                source={normalizeImageSource(item.bannerImage || item.image, placeholderImage)} 
                className="w-full h-full rounded-5xl overflow-hidden" 
                borderRadius={20}
              >
                <View className="absolute top-4 left-4">
                  <View className="bg-white rounded-lg p-2 items-center shadow-sm">
                    <Text className="text-xs font-outfit-bold text-primary">{getMonth(item.dateTime)}</Text>
                    <Text className="text-lg font-outfit-bold text-textprimary">{getDay(item.dateTime)}</Text>
                  </View>
                </View>
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-xs font-outfit text-white mb-1 shadow-sm">{(item.category || "").toUpperCase()}</Text>
                  <Text className="text-xl font-outfit-bold text-white shadow-sm" numberOfLines={2}>{item.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Category Icons Section */}
      <View className="mt-6">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">EVENT CATEGORIES</Text>
          <View className="flex-1 h-px bg-primary" />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoriesWithCounts}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.key;
            return (
              <TouchableOpacity className="items-center mr-5" onPress={() => handleCategoryPress(item.key)}>
                <View className={`w-16 h-16 rounded-full items-center justify-center border ${isSelected ? "border-primary" : "border-gray-200"} bg-white overflow-hidden`}>
                  {item.image ? (
                    <Image source={normalizeImageSource(item.image, placeholderImage)} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={28} color={isSelected ? "#02757A" : "#6B7280"} />
                  )}
                </View>
                <Text className={`mt-2 text-xs font-outfit text-center ${isSelected ? "text-primary" : "text-textprimary"}`} numberOfLines={2}>{item.title}</Text>
                <Text className="font-outfit text-textsecondary mt-1" style={{ fontSize: 10 }}>{item.count} event{item.count === 1 ? "" : "s"}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Footer of Header: List Controls */}
      <View className="mt-6">
        <View className="flex-row items-center">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">ALL EVENTS</Text>
          <View className="flex-1 h-px bg-primary" />
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <View>
            <Text className="text-sm font-outfit-bold text-textprimary">{filteredCount} events found</Text>
            <Text className="text-xs font-outfit text-textsecondary mt-1">Scroll to explore the lineup</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setFilterVisible(true)} 
            className="flex-row items-center px-4 py-2 rounded-full border border-primary bg-primary shadow-sm"
          >
            <MaterialCommunityIcons name="filter" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text className="text-sm font-outfit-medium text-white">Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function Events() {
  const { safeNavigation } = useSafeNavigation();
  
  // State: Modals and Visibility
  const [filterVisible, setFilterVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  
  // State: Filtering and Search
  const [appliedFilters, setAppliedFilters] = useState({ ...DEFAULT_FILTERS });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State: Data
  const [events, setEvents] = useState([]);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    setLoadingEvents(true);

    fetchEvents()
      .then((fetched) => {
        if (isMounted) {
          setEvents(fetched || []);
          setEventsError(null);
        }
      })
      .catch((error) => {
        if (isMounted) setEventsError(error);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });

    return () => { isMounted = false; };
  }, []);

  // --- Memos ---
  const featuredEvents = useMemo(() => events.filter((e) => e.featured), [events]);

  const categoriesWithCounts = useMemo(() => {
    const counts = events.reduce((acc, event) => {
      const key = event.category;
      if (key) acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return eventCategories
      .filter((category) => category.key === "all" || counts[category.key])
      .map((category) => ({
        ...category,
        count: category.key === "all" ? events.length : counts[category.key] || 0,
      }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const filters = appliedFilters || DEFAULT_FILTERS;
    let result = [...events];

    // Search Query Filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((event) => {
        const title = event.title || "";
        const city = event.city || "";
        const venueName = typeof event.venue === "string" ? event.venue : event.venue?.name || "";
        const locationName = typeof event.location === "string" ? event.location : event.location?.name || "";
        return [title, city, venueName, locationName].some(v => String(v).toLowerCase().includes(query));
      });
    }

    // Location Filter
    if (filters.location) {
      const target = String(filters.location).toLowerCase();
      result = result.filter((e) => String(e.city || "").toLowerCase() === target);
    }

    // Category Circular Filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Modal Filters: Show Types
    if (filters.typesOfShow?.length) {
      const allowed = filters.typesOfShow.map((t) => typeToCategoryMap[t]).filter(Boolean);
      result = result.filter((e) => allowed.includes(e.category));
    }

    // Modal Filters: Timing
    if (filters.timing === "today") {
      const now = new Date();
      result = result.filter((e) => {
        const d = parseDate(e.dateTime);
        return d ? isSameDay(d, now) : false;
      });
    }

    return result;
  }, [events, appliedFilters, selectedCategory, searchQuery]);

  // --- Handlers ---
  const handleCategoryPress = useCallback((categoryKey) => {
    if (categoryKey === 'all') {
      // Navigate to LiveEventPage when "All Events" is clicked
      safeNavigation("/screens/LiveEventPage");
    } else {
      setSelectedCategory(categoryKey);
    }
  }, [safeNavigation]);

  const handleOpenEventDetails = useCallback((event) => {
    safeNavigation({
      pathname: "/screens/EventDetails",
      params: { eventId: event.id }
    });
  }, [safeNavigation]);

  const handleCloseEventDetails = useCallback(() => {
    setEventModalVisible(false);
    setSelectedEventData(null);
  }, []);

  const getMonth = useCallback((isoString) => {
    const date = parseDate(isoString);
    if (!date) return '';
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthNames[date.getMonth()];
  }, []);

  const getDay = useCallback((isoString) => {
    const date = parseDate(isoString);
    return date ? date.getDate() : '';
  }, []);

  // --- Render Functions ---
  const renderEventCard = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleOpenEventDetails(item)}
        activeOpacity={0.85}
        className="mb-4"
      >
        <View className="flex-row items-center border border-primary/20 rounded-3xl p-4 bg-white shadow-sm">
          <Image source={normalizeImageSource(item.image, placeholderImage)} className="w-24 h-24 rounded-2xl" />
          <View className="flex-1 ml-4 justify-center">
            <Text className="text-xs font-outfit text-primary mb-1">{toDisplayText(item.category).toUpperCase()}</Text>
            <Text className="text-lg font-outfit-bold text-textprimary mb-1" numberOfLines={1}>{item.title}</Text>
            <Text className="text-sm font-outfit text-textsecondary">
              {[toDisplayText(item.date), toDisplayText(item.startTime)].filter(Boolean).join(' • ')}
            </Text>
            <Text className="text-xs font-outfit text-textsecondary mt-1" numberOfLines={1}>
              {formatVenueText(item.venue, item.location)}
            </Text>
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <Text className="ml-1 text-xs font-outfit text-textsecondary">
                {(() => {
                  const rating = item.rating;
                  if (typeof rating === 'object' && rating !== null) {
                    return rating.average || '4.5';
                  }
                  return rating || '4.5';
                })()} • {item.attendees || '—'} attending
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleOpenEventDetails]
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEventCard}
        ListHeaderComponent={() => (
          <EventsHeader
            safeNavigation={safeNavigation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            featuredEvents={featuredEvents}
            categoriesWithCounts={categoriesWithCounts}
            selectedCategory={selectedCategory}
            handleCategoryPress={handleCategoryPress}
            filteredCount={filteredEvents.length}
            getMonth={getMonth}
            getDay={getDay}
            setFilterVisible={setFilterVisible}
            onEventClick={handleOpenEventDetails}
          />
        )}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={() => (
          <View className="py-20 items-center justify-center">
            {loadingEvents ? (
              <ActivityIndicator size="large" color="#02757A" />
            ) : (
              <View className="items-center px-10">
                <Ionicons name="calendar-outline" size={60} color="#CBD5E1" />
                <Text className="mt-4 text-sm font-outfit-bold text-textprimary text-center">
                  No Events Match Your Search
                </Text>
                <Text className="mt-2 text-xs font-outfit text-textsecondary text-center">
                  Try adjusting your filters or searching for something else.
                </Text>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* 5. Modals Container */}
      
      {/* Search Filter Modal */}
      <FilterShow
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => {
          setAppliedFilters({ ...DEFAULT_FILTERS, ...filters });
          setFilterVisible(false);
        }}
        initialFilters={appliedFilters}
      />

      {/* Main Event Details Modal (Triggered by any event click) */}
      <EventDetailsModal 
        event={selectedEventData} 
        visible={eventModalVisible} 
        onClose={handleCloseEventDetails} 
      />
      
    </View>
  );
}