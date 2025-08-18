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
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function TiffinCollection() {
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
        const isTiffinProvider = firm.services?.includes('tiffin');
        return matchesSearch && isTiffinProvider;
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
        <Text style={styles.emptyStateMessage}>Loading tiffin providers...</Text>
      </View>
    );
  }

  const renderFirmCard = ({ item: firm }) => (
    <FirmCard
      firm={firm}
      onPress={() => safeNavigation({
        pathname: '/screens/TiffinDetails',
        params: { firmId: firm.id }
      })}
      // showSubscriptionBadge={activeSubscription?.firmId === firm.id}
    />
  );

  return (
    <View style={styles.container}>
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
        placeholder="Search tiffin providers..."
      />

      {filteredFirms.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="food-off" 
            size={48} 
            color="#666" 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Tiffin Providers Found</Text>
          <Text style={styles.emptyStateMessage}>
            Try adjusting your search or check back later for new providers.
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