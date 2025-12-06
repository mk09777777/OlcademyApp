import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import FilterShow from '@/components/FilterShow';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { events, eventCategories } from '@/Data/EventData';

const DEFAULT_FILTERS = {
  sortBy: 'mostPopular',
  location: null,
  typesOfShow: [],
  timing: 'anytime',
  customDate: null,
};

const typeToCategoryMap = {
  Concert: 'concert',
  'Stand-up': 'comedy',
  Drama: 'drama',
  Workshop: 'workshop',
  Festival: 'festival',
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const getUpcomingWeekendRange = (fromDate) => {
  const base = new Date(fromDate);
  base.setHours(0, 0, 0, 0);

  const day = base.getDay();
  const saturdayOffset = (6 - day + 7) % 7;
  const sundayOffset = (7 - day + 7) % 7;

  const saturday = new Date(base);
  saturday.setDate(base.getDate() + saturdayOffset);
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(base);
  sunday.setDate(base.getDate() + sundayOffset);
  sunday.setHours(23, 59, 59, 999);

  return { saturday, sunday };
};

export default function Events() {
  const { safeNavigation } = useSafeNavigation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ ...DEFAULT_FILTERS });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredEvents = useMemo(
    () => events.filter((event) => event.featured),
    [events]
  );

  const categoriesWithCounts = useMemo(() => {
    const counts = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});

    return eventCategories
      .filter((category) => category.key === 'all' || counts[category.key])
      .map((category) => ({
        ...category,
        count: category.key === 'all' ? events.length : counts[category.key] || 0,
      }));
  }, [events, eventCategories]);

  const filteredEvents = useMemo(() => {
    const filters = appliedFilters || DEFAULT_FILTERS;
    let result = [...events];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((event) =>
        event.title.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }

    if (filters.location) {
      const targetCity = filters.location.toLowerCase();
      result = result.filter((event) => event.city.toLowerCase() === targetCity);
    }

    if (filters.typesOfShow && filters.typesOfShow.length) {
      const allowedCategories = filters.typesOfShow
        .map((type) => typeToCategoryMap[type])
        .filter(Boolean);

      if (allowedCategories.length) {
        result = result.filter((event) => allowedCategories.includes(event.category));
      }
    }

    if (filters.timing && filters.timing !== 'anytime') {
      const now = new Date();
      if (filters.timing === 'today') {
        result = result.filter((event) => {
          const eventDate = parseDate(event.dateTime);
          return eventDate ? isSameDay(eventDate, now) : false;
        });
      } else if (filters.timing === 'thisWeekend') {
        const { saturday, sunday } = getUpcomingWeekendRange(now);
        result = result.filter((event) => {
          const eventDate = parseDate(event.dateTime);
          return eventDate ? eventDate >= saturday && eventDate <= sunday : false;
        });
      } else if (filters.timing === 'custom' && filters.customDate) {
        const custom = new Date(filters.customDate);
        custom.setHours(0, 0, 0, 0);
        result = result.filter((event) => {
          const eventDate = parseDate(event.dateTime);
          return eventDate ? isSameDay(eventDate, custom) : false;
        });
      }
    }

    const sorted = [...result];
    switch (filters.sortBy) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = parseDate(a.dateTime);
          const dateB = parseDate(b.dateTime);

          if (!dateA || !dateB) return 0;
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'highestRated':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'mostPopular':
      default:
        sorted.sort((a, b) => (b.attendees || 0) - (a.attendees || 0));
        break;
    }

    return sorted;
  }, [appliedFilters, searchQuery, events]);

  const filteredCount = filteredEvents.length;

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

  const handleCategoryPress = useCallback((categoryKey) => {
    setSelectedCategory(categoryKey);
    safeNavigation({
      pathname: 'screens/LiveEventPage',
      params: categoryKey && categoryKey !== 'all' ? { focusCategory: categoryKey } : {},
    });
  }, [safeNavigation]);

  const renderListHeader = useCallback(() => (
    <View className="pb-6">
      <View className="pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-outfit-bold text-textprimary">
            Explore Events
          </Text>
          <TouchableOpacity onPress={() => safeNavigation('/screens/User')}>
            <Ionicons name="person-circle-outline" size={40} color="#02757A" />
          </TouchableOpacity>
        </View>

        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          placeholder="Search events..."
          widthClass="100%"
          onVoicePress={() => {}}
        />
      </View>

      <View className="mt-6">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">
            FEATURED
          </Text>
          <View className="flex-1 h-px bg-primary" />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 8 }}
          keyExtractor={(item) => item.id}
          data={featuredEvents}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-72 h-48 mr-3"
              onPress={() => {
                safeNavigation({
                  pathname: 'screens/EventDetails',
                  params: { eventId: item.id },
                });
              }}
              activeOpacity={0.85}
            >
              <ImageBackground
                source={item.bannerImage || item.image}
                className="w-full h-full rounded-5xl overflow-hidden"
                borderRadius={20}
              >
                <View className="absolute top-4 left-4">
                  <View className="bg-white rounded-lg p-2 items-center">
                    <Text className="text-xs font-outfit-bold text-primary">
                      {getMonth(item.dateTime)}
                    </Text>
                    <Text className="text-lg font-outfit-bold text-textprimary">
                      {getDay(item.dateTime)}
                    </Text>
                  </View>
                </View>
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-xs font-outfit text-white mb-1">
                    {item.category.toUpperCase()}
                  </Text>
                  <Text className="text-xl font-outfit-bold text-white">
                    {item.title}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="mt-6">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">
            EVENT CATEGORIES
          </Text>
          <View className="flex-1 h-px bg-primary" />
        </View>

        <FlatList
          horizontal
          data={categoriesWithCounts}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16, paddingBottom: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.key;
            const hasImage = Boolean(item.image);
            return (
              <TouchableOpacity
                className="items-center mr-5"
                onPress={() => handleCategoryPress(item.key)}
                activeOpacity={0.85}
              >
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center border ${
                    isSelected ? 'border-primary' : 'border-gray-200'
                  } bg-white overflow-hidden`}
                >
                  {hasImage ? (
                    <Image
                      source={item.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={28}
                      color={isSelected ? '#02757A' : '#6B7280'}
                    />
                  )}
                </View>
                <Text
                  className={`mt-2 text-xs font-outfit text-center ${
                    isSelected ? 'text-primary' : 'text-textprimary'
                  }`}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  className="font-outfit text-textsecondary mt-1"
                  style={{ fontSize: 10 }}
                >
                  {item.count} event{item.count === 1 ? '' : 's'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View className="mt-6">
        <View className="flex-row items-center">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">
            ALL EVENTS
          </Text>
          <View className="flex-1 h-px bg-primary" />
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <View>
            <Text className="text-sm font-outfit-bold text-textprimary">
              {filteredCount} events
            </Text>
            <Text className="text-xs font-outfit text-textsecondary mt-1">
              Browse everything in one scroll
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            className="flex-row items-center px-3 py-2 rounded-full border border-primary bg-primary"
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="filter" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text className="text-sm font-outfit-medium text-white">
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [categoriesWithCounts, featuredEvents, filteredCount, getDay, getMonth, handleCategoryPress, safeNavigation, searchQuery, selectedCategory]);

  const renderEventCard = useCallback(({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-3xl mb-4 shadow-sm"
      onPress={() => {
        safeNavigation({
          pathname: 'screens/EventDetails',
          params: { eventId: item.id },
        });
      }}
      activeOpacity={0.85}
    >
  <View className="flex-row items-center border border-primary/40 rounded-3xl p-4">
        <Image
          source={item.image}
          className="w-20 h-20 rounded-2xl"
        />
        <View className="flex-1 ml-4 justify-center">
          <Text className="text-xs font-outfit text-primary mb-1">
            {item.category.toUpperCase()}
          </Text>
          <Text className="text-lg font-outfit-bold text-textprimary mb-1">
            {item.title}
          </Text>
          <Text className="text-sm font-outfit text-textsecondary">
            {item.date} • {item.startTime}
          </Text>
          <Text className="text-xs font-outfit text-textsecondary mt-1" numberOfLines={1}>
            {item.venue}
          </Text>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
            <Text className="ml-1 text-xs font-outfit text-textsecondary">
              {item.rating ? item.rating.toFixed(1) : '4.5'} • {item.attendees} attending
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [safeNavigation]);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={() => (
          <View className="py-10 items-center">
            <MaterialCommunityIcons name="calendar-remove" size={32} color="#9CA3AF" />
            <Text className="mt-3 text-sm font-outfit text-textsecondary">
              No events match your filters yet.
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <FilterShow
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => {
          setAppliedFilters({
            ...DEFAULT_FILTERS,
            ...filters,
          });
          setFilterVisible(false);
        }}
        initialFilters={appliedFilters}
      />
    </View>
  )
}
