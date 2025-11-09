import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useMemo, useState, useCallback } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import SearchBar from '@/components/SearchBar'
import FilterShow from '@/components/FilterShow'
import { useSafeNavigation } from '@/hooks/navigationPage';
import { events, eventCategories } from '@/Data/EventData';

export default function Events() {
  const { safeNavigation } = useSafeNavigation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
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
    const baseList = selectedCategory === 'all'
      ? events
      : events.filter((event) => event.category === selectedCategory);

    if (!searchQuery.trim()) {
      return baseList;
    }

    const query = searchQuery.trim().toLowerCase();
    return baseList.filter((event) =>
      event.title.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    );
  }, [events, selectedCategory, searchQuery]);

  const getMonth = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthNames[date.getMonth()];
  };

  const getDay = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.getDate();
  };

  const renderListHeader = useCallback(() => (
    <View className="py-4 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-outfit-bold text-textprimary">
          Explore Events
        </Text>
        <TouchableOpacity onPress={() => safeNavigation('/screens/User')}>
          <Ionicons name='person-circle-outline' size={40} color='#02757A' />
        </TouchableOpacity>
      </View>

      <View className="mr-1.5 ml-1.5">
        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          placeholder="Search events..."
          widthClass="100%"
          onVoicePress={() => {}}
        />
      </View>

      <View className="flex-row items-center mt-4 mb-3">
        <View className="flex-1 h-px bg-primary" />
        <Text className="font-outfit text-xs text-textprimary mx-2">
          FEATURED
        </Text>
        <View className="flex-1 h-px bg-primary" />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={{ paddingHorizontal: 0 }}
        keyExtractor={(item) => item.id}
        data={featuredEvents}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-80 h-48 mx-2"
            onPress={() => {
              safeNavigation({
                pathname: 'screens/EventDetails',
                params: { eventId: item.id }
              })
            }}
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

      <View className="mt-6">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">
            ALL CATEGORIES
          </Text>
          <View className="flex-1 h-px bg-primary" />
        </View>

        <FlatList
          horizontal
          data={categoriesWithCounts}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.key;
            return (
              <TouchableOpacity
                className="mr-3"
                onPress={() => setSelectedCategory(item.key)}
                activeOpacity={0.9}
              >
                <View
                  className={`rounded-3xl px-4 py-3 border ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
                  }`}
                  style={{ minWidth: 140 }}
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={20}
                      color={isSelected ? '#02757A' : '#6B7280'}
                    />
                    <Text
                      className={`ml-2 text-sm font-outfit-bold ${
                        isSelected ? 'text-primary' : 'text-textprimary'
                      }`}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-xs text-textsecondary font-outfit mt-1">
                    {item.count} event{item.count === 1 ? '' : 's'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View className="flex-row items-center mt-6 mb-3">
        <View className="flex-1 h-px bg-primary" />
        <Text className="font-outfit text-xs text-textprimary mx-2">
          {selectedCategory === 'all' ? 'ALL EVENTS' : `${selectedCategory.toUpperCase()} EVENTS`}
        </Text>
        <View className="flex-1 h-px bg-primary" />
      </View>

      <TouchableOpacity
        onPress={() => setFilterVisible(true)}
        className="self-end bg-primary px-4 py-2 rounded-full mb-4"
      >
        <Text className="text-white font-outfit-bold text-sm">
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  ), [featuredEvents, safeNavigation, searchQuery, selectedCategory, categoriesWithCounts]);

  const renderEventCard = useCallback(({ item }) => (
    <TouchableOpacity
      className="flex-row bg-white rounded-3xl mb-4 p-4 shadow-sm mx-4"
      onPress={() => {
        safeNavigation({
          pathname: 'screens/EventDetails',
          params: { eventId: item.id },
        })
      }}
    >
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
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <FilterShow
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => {
          console.log("Applied filters:", filters);
          setAppliedFilters(filters);
          setFilterVisible(false);
        }}
      />
    </View>
  )
}
