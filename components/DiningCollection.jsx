import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collections } from '@/Data/EventCollection';
import { useFirm } from '@/context/FirmContext';
import FirmCard from '@/components/FirmCard';
import SearchBar from '@/components/SearchBar';

import BackRouting from '@/components/BackRouting';
import { useSafeNavigation } from '@/hooks/navigationPage';

export default function DiningCollection() {
  const { collectionId } = useGlobalSearchParams();
  const router = useRouter();
  const { firms, loading: firmsLoading } = useFirm();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFirms, setFilteredFirms] = useState([]);
  const { safeNavigation } = useSafeNavigation();
  const collection = collections.find(c => c.id === collectionId);

  useEffect(() => {
    if (firms) {
      const filtered = firms.filter(firm => {
        const matchesSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isDiningProvider = firm.services?.includes('dining');
        return matchesSearch && isDiningProvider;
      });
      setFilteredFirms(filtered);
    }
  }, [firms, searchQuery]);

  if (!collection) {
    return (
      <View className="flex-1 items-center justify-center p-10">
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={48} 
          color="#666" 
        />
        <Text className="text-lg font-outfit-medium color-gray-800 mt-4 mb-2">Collection Not Found</Text>
        <Text className="text-base font-outfit color-gray-600 text-center">
          The collection you're looking for doesn't exist or has been removed.
        </Text>
      </View>
    );
  }

  if (firmsLoading) {
    return (
      <View className="flex-1 items-center justify-center p-10">
        <ActivityIndicator size="large" />
        <Text className="text-base font-outfit color-gray-600 text-center mt-4">Loading dining establishments...</Text>
      </View>
    );
  }

  const renderFirmCard = ({ item: firm }) => (
    <FirmCard
      firm={firm}
      onPress={() => safeNavigation({
        pathname: '/screens/FirmDetailsDining',
        params: { firmId: firm.id }
      })}
      showOfferBadge={!!firm.activeOffers?.length}
    />
  );

  return (
    <View className="flex-1 bg-white">
      <BackRouting title = 'Dining Collection'/>
      <View className="bg-white rounded-3 mb-4 overflow-hidden shadow-sm mx-4 mt-4">
        <View className="p-4">
          <Text className="text-base font-outfit-bold color-gray-800 mb-1">{collection.title}</Text>
          <Text className="text-sm font-outfit color-gray-600 mb-1">{collection.description}</Text>
          <Text className="text-sm font-outfit color-gray-600">
            {collection.dishes} dishes • {collection.restaurants} restaurants
          </Text>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search restaurants..."
      />

      {filteredFirms.length === 0 ? (
        <View className="flex-1 items-center justify-center p-10">
          <MaterialCommunityIcons 
            name="food-off" 
            size={48} 
            color="#666" 
          />
          <Text className="text-lg font-outfit-medium color-gray-800 mt-4 mb-2">No Restaurants Found</Text>
          <Text className="text-base font-outfit color-gray-600 text-center">
            Try adjusting your search or check back later for new restaurants.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFirms}
          renderItem={renderFirmCard}
          keyExtractor={item => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}