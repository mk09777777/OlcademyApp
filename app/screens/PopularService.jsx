import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import { FilterModal } from '../../components/FilterModal';
import useTiffinHome  from '../../hooks/useTiffinHome';
import { usePreferences } from '../../context/PreferencesContext';
import SearchBar from '../../components/SearchBar';
import tiffinData from '../../Data/tiffin.json';
import BackRouting from '@/components/BackRouting';
// import styles from '../../styles/tiffinstyle';
import { useSafeNavigation } from '@/hooks/navigationPage';
const { width } = Dimensions.get('window');

const PopularService = () => {
  const router = useRouter();
  const { userPreferences } = usePreferences();
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const { safeNavigation } = useSafeNavigation();
  const {
    isLoading,
    showFilterModal,
    setShowFilterModal,
    filters,
    selectedFilters,
    handleFilterChange,
    resetFilters,
    applyCurrentFilters,
    priceRange,
    setPriceRange,
    localDietaryPreferencesOptions,
    toggleDietaryPreference,
    localCuisines,
    toggleCuisine,
  } = useTiffinHome();

  const loadPopularServices = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!tiffinData) {
        throw new Error('No tiffin data available');
      }

      const data = Array.isArray(tiffinData) ? tiffinData : [];
      
      let popularTiffins = data.filter(item => {
        if (!item || !item.Title) return false;
        const rating = parseFloat(item.Rating);
        return !isNaN(rating) && rating >= 4.0;
      });
      
      popularTiffins = popularTiffins.sort((a, b) => {
        const ratingA = parseFloat(a.Rating) || 0;
        const ratingB = parseFloat(b.Rating) || 0;
        return ratingB - ratingA;
      });
      
      setLocalTiffinData(popularTiffins);
    } catch (err) {
      console.error('Error loading popular tiffin data:', err);
      setError(err);
      setLocalTiffinData([]);
    } finally {
      setIsRefreshing(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularServices();
  }, [loadPopularServices]);

  const handleRefresh = useCallback(() => {
    loadPopularServices();
  }, [loadPopularServices]);

  const handleFavoriteToggle = (title) => {
    setLocalTiffinData(prev => 
      prev.map(item => 
        item.Title === title ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredTiffins = localTiffinData.filter(item => {
    if (!item || !item.Title) return false;
    
    const matchesSearch = searchQuery 
      ? item.Title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    if (!matchesSearch) return false;

    const mealTypes = item["Meal_Types"] || item["Meal Types"] || [];
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.every(filter => mealTypes.includes(filter));

    const itemPrice = parseFloat(Object.values(item.Prices || {})[0]) || 0;
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];

    const matchesDietary = localDietaryPreferencesOptions.length === 0 ||
      (item.dietaryOptions && localDietaryPreferencesOptions.every(pref => 
        item.dietaryOptions.includes(pref))
      );

    const matchesCuisine = localCuisines.length === 0 ||
      (item.cuisine && localCuisines.some(cuisine => 
        item.cuisine.includes(cuisine))
      );

    return matchesSearch && matchesFilters && matchesPrice && matchesDietary && matchesCuisine;
  });

  const renderServiceItem = ({ item }) => (
    <View style={styles.fullWidthCard}>
      <TiffinCard
        firm={{
          image: item.Images?.[0] || require('../../assets/images/food.jpg'),
          title: item.Title || 'Unknown Service',
          rating: item.Rating || '0',
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
        horizontal={false} // Changed to vertical layout
        // showSubscriptionBadge={activeSubscription && item.acceptsSubscription}
        userPreferences={userPreferences}
        popularBadge={true}
        fullWidth={true} // Added prop for full width
      />
    </View>
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackRouting tittle = "Popular Service"/>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text style={styles.loadingText}>Loading popular services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4B3A" />
          <Text style={styles.errorText}>Failed to load popular services</Text>
          <Text style={styles.errorDetail}>{error.message || 'Please try again later'}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.retryButtonText}>Retry</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity> */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search popular services..."
          style={{flex: 1, marginHorizontal: 10}}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <MaterialCommunityIcons name="tune" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {filteredTiffins.length === 0 && !isRefreshing ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="silverware" size={48} color="#757575" />
          <Text style={styles.emptyText}>No popular tiffin services found</Text>
          <Text style={styles.emptySubText}>
            {searchQuery || selectedFilters.length > 0 
              ? "Try adjusting your search or filters" 
              : "There might be no services available right now"}
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              resetFilters();
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTiffins}
          renderItem={renderServiceItem}
          keyExtractor={item => item.Title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalListContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#FF4B3A']}
              tintColor="#FF4B3A"
            />
          }
        />
      )}

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

// Add these styles to your tiffinstyle.js
const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF4B3A',
      marginTop: 16,
      marginBottom: 8,
    },
    errorDetail: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: '#FF4B3A',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
    },
    retryButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    fullWidthCard: {
      width: width - 32,
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    verticalListContainer: {
      paddingVertical: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubText: {
      fontSize: 14,
      color: '#666',
      marginTop: 8,
      textAlign: 'center',
    },
    resetButton: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
    },
    resetButtonText: {
      color: '#FF4B3A',
      fontWeight: 'bold',
    },
    // Add these if you need horizontal card styles as well
    serviceCard: {
      width: width * 0.8,
      marginRight: 16,
      marginLeft: 8,
      marginBottom: 16,
    },
    listContainer: {
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 8,
    },
  // ... keep your existing styles
};

export default PopularService;