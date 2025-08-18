import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collections } from '@/Data/EventCollection';
import { useFirm } from '@/context/FirmContext';
import FirmCard from '@/components/FirmCard';
import SearchBar from '@/components/SearchBar';
import styles from '@/styles/Collection';
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
        <Text style={styles.emptyStateMessage}>Loading dining establishments...</Text>
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
    <View style={styles.container}>
      <BackRouting title = 'Dining Collection'/>
      <View style={styles.collectionCard}>
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{collection.title}</Text>
          <Text style={styles.collectionInfo}>{collection.description}</Text>
          <Text style={styles.collectionInfo}>
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
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="food-off" 
            size={48} 
            color="#666" 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Restaurants Found</Text>
          <Text style={styles.emptyStateMessage}>
            Try adjusting your search or check back later for new restaurants.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFirms}
          renderItem={renderFirmCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.firmList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}