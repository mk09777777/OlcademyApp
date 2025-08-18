import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  Dimensions,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import {FilterModal} from '../../components/FilterModal';
import useTiffinHome from '../../hooks/useTiffinHome'; 
import SearchBar from '../../components/SearchBar';
import tiffinData from '../../Data/tiffin.json';
// import styles from '../../styles/tiffinstyle';
import { useSafeNavigation } from '@/hooks/navigationPage';
const NearbyService = () => {
  const router = useRouter();
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { safeNavigation } = useSafeNavigation();
  const {
    isLoading,
    error,
    showFilterModal,
    setShowFilterModal,
    filters,
    selectedFilters,
    handleFilterChange,
    resetFilters,
    applyCurrentFilters,
    handleRefresh,
    priceRange,
    setPriceRange,
    localDietaryPreferencesOptions,
    toggleDietaryPreference,
    localCuisines,
    toggleCuisine,
  } = useTiffinHome();

  useEffect(() => {
    loadTiffinData();
  }, []);

  const loadTiffinData = () => {
    try {
      // Ensure tiffinData is properly imported and is an array
      if (!Array.isArray(tiffinData)) {
        throw new Error('Tiffin data is not an array');
      }
      
      const nearbyTiffins = tiffinData.filter(item => {
        // Check if item exists and has Delivery_Cities property
        return item && item.Delivery_Cities && item.Delivery_Cities.includes('Mississauga');
      });
      
      setLocalTiffinData(nearbyTiffins);
    } catch (error) {
      console.error('Error loading nearby tiffin data:', error);
      setLocalTiffinData([]);
    }
  };

  const handleFavoriteToggle = (title) => {
    setLocalTiffinData(prev => 
      prev.map(item => 
        item.Title === title ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredTiffins = localTiffinData.filter(item => {
    if (!item) return false;
    
    // Search filter
    const matchesSearch = item.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    if (!matchesSearch) return false;

    // Filter by selected filters
    if (selectedFilters.length > 0) {
      const matchesFilters = selectedFilters.every(filter => 
        item["Meal_Types"]?.includes(filter)
      );
      if (!matchesFilters) return false;
    }

    // Filter by price range
    const itemPrice = Object.values(item.Prices || {})[0];
    if (itemPrice && (itemPrice < priceRange[0] || itemPrice > priceRange[1])) return false;

    // Filter by dietary preferences
    if (localDietaryPreferencesOptions.length > 0) {
      const matchesDietary = localDietaryPreferencesOptions.every(pref => 
        item.dietaryOptions?.includes(pref)
      );
      if (!matchesDietary) return false;
    }

    // Filter by cuisines
    if (localCuisines.length > 0) {
      const matchesCuisine = localCuisines.some(cuisine => 
        item.cuisine?.includes(cuisine)
      );
      if (!matchesCuisine) return false;
    }

    return true;
  });

  const renderServiceItem = ({ item }) => (
    <View style={[styles.serviceCard, { width: Dimensions.get('window').width - 32 }]}>
      <TiffinCard
        firm={{
          image: item.Images?.[0] || require('../../assets/images/food1.jpg'),
          title: item.Title,
          rating: item.Rating,
          priceRange: Object.values(item.Prices || {})[0] || 'N/A',
          mealTypes: item["Meal_Types"] || item["Meal Types"] || [],
          deliveryCities: item.Delivery_Cities || []
        }}
        onPress={() => {
          if (!item || !item.Title) {
            Alert.alert('Error', 'Invalid tiffin service data');
            return;
          }
          safeNavigation({
            pathname: '/screens/TiffinDetails',
            params: { title: item.Title }
          });
        }}
        onFavoriteToggle={() => handleFavoriteToggle(item.Title)}
        isFavorite={item.isFavorite}
        horizontal={false}
      />
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4B3A" />
          <Text style={styles.errorText}>Failed to load nearby services</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTiffinData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search nearby services..."
          style={{flex: 1, marginHorizontal: 10}}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <MaterialCommunityIcons name="tune" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTiffins}
        renderItem={renderServiceItem}
        keyExtractor={item => item.Title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="silverware" size={48} color="#757575" />
            <Text style={styles.emptyText}>No nearby tiffin services found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters or location</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              handleRefresh();
              loadTiffinData();
            }}
            colors={['#FF4B3A']}
          />
        }
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onApply={applyCurrentFilters}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        dietaryPreferences={localDietaryPreferencesOptions}
        onDietaryPreferenceToggle={toggleDietaryPreference}
        cuisines={localCuisines}
        onCuisineToggle={toggleCuisine}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  serviceCard: {
    width: '101%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '80%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d32f2f',
    marginTop: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default NearbyService;