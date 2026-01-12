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

/* Original CSS Reference from styles/Collection.jsx:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { height: 250 },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  tabContainer: { flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabButton: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20, backgroundColor: '#f8f8f8' },
  activeTab: { backgroundColor: '#ffe5e8', borderWidth: 1, borderColor: '#E41E3F' },
  tabText: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666' },
  activeTabText: { color: '#E41E3F', fontFamily: 'outfit-bold' },
  searchContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInput: { backgroundColor: '#fff' },
  collectionContainer: { padding: 16 },
  collectionCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, width: '100%' },
  collectionImage: { width: '100%', height: 140, resizeMode: 'cover' },
  collectionContent: { padding: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 2 },
  cardWrapper: { width: '48%', marginBottom: 15 },
  collectionTitle: { fontSize: 16, fontFamily: 'outfit-bold', color: '#333', marginBottom: 4 },
  collectionInfo: { fontSize: 12, fontFamily: 'outfit', color: '#666' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyStateText: { fontSize: 16, fontFamily: 'outfit-medium', color: '#999', textAlign: 'center', marginTop: 16 },
  offersTrack: { paddingLeft: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }
});
*/
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
        <Text className="text-base font-medium text-gray-600 text-center mt-4">Collection Not Found</Text>
        <Text className="text-base font-medium text-gray-600 text-center mt-4">
          The collection you're looking for doesn't exist or has been removed.
        </Text>
      </View>
    );
  }

  if (firmsLoading) {
    return (
      <View className="flex-1 items-center justify-center p-10">
        <ActivityIndicator size="large" />
        <Text className="text-base font-medium text-gray-600 text-center mt-4">Loading dining establishments...</Text>
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
      <View className="bg-white rounded-xl mb-4 shadow-sm">
        <View className="p-3">
          <Text className="text-base font-bold text-gray-800 mb-1">{collection.title}</Text>
          <Text className="text-xs text-gray-600">{collection.description}</Text>
          <Text className="text-xs text-gray-600">
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
          <Text className="text-base font-medium text-gray-600 text-center mt-4">No Restaurants Found</Text>
          <Text className="text-base font-medium text-gray-600 text-center mt-4">
            Try adjusting your search or check back later for new restaurants.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFirms}
          renderItem={renderFirmCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}