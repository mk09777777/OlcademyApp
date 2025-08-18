import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
 
  Alert,
} from 'react-native';
import BackRouting from '@/components/BackRouting';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import { FilterModal } from '../../components/FilterModal';
import useTiffinHome from '../../hooks/useTiffinHome';
import { usePreferences } from '../../context/PreferencesContext';
import SearchBar from '../../components/SearchBar';
import tiffinData from '../../Data/tiffin.json';
import styles from '../../styles/tiffinstyle';
import { useSafeNavigation } from '@/hooks/navigationPage';
const RecommendationScreen = () => {
  const router = useRouter();
  const { userPreferences = {} } = usePreferences(); // Default empty object
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
 const { safeNavigation } = useSafeNavigation();
  const {
    isLoading,
    showFilterModal,
    setShowFilterModal,
    filters,
    selectedFilters = [],
    handleFilterChange,
    resetFilters,
    applyCurrentFilters,
    handleRefresh,
    priceRange = [0, 101],
    setPriceRange,
    localDietaryPreferencesOptions = [],
    toggleDietaryPreference,
    localCuisines = [],
    toggleCuisine,
  } = useTiffinHome();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setIsInitialLoad(true);
        
        // 1. Basic data validation
        if (!Array.isArray(tiffinData)) {
          throw new Error('Tiffin data is not an array');
        }

        // 2. Create safe copy of data
        let recommendedTiffins = [...tiffinData].filter(Boolean);

        // 3. Add match scoring only if user preferences exist
        if (userPreferences && Object.keys(userPreferences).length > 0) {
          recommendedTiffins = recommendedTiffins.map(item => {
            let matchScore = 0;

            // Dietary preferences matching
            if (userPreferences.dietaryPreferences && item.dietaryOptions) {
              const matchingDietary = userPreferences.dietaryPreferences.filter(pref =>
                item.dietaryOptions.includes(pref)
              ).length;
              matchScore += userPreferences.dietaryPreferences.length > 0 
                ? (matchingDietary / userPreferences.dietaryPreferences.length) * 40 
                : 0;
            }

            // Cuisine preferences matching
            if (userPreferences.cuisinePreferences && item.cuisine) {
              const matchingCuisine = userPreferences.cuisinePreferences.filter(cuisine =>
                item.cuisine.includes(cuisine)
              ).length;
              matchScore += userPreferences.cuisinePreferences.length > 0
                ? (matchingCuisine / userPreferences.cuisinePreferences.length) * 30
                : 0;
            }

            // Rating (with fallback)
            const rating = parseFloat(item.rating) || 0;
            matchScore += (rating / 5) * 20;

            // Price range (with fallbacks)
            const itemPrice = parseFloat(item.price) || 0;
            const minPrice = parseFloat(userPreferences.minPrice) || 0;
            const maxPrice = parseFloat(userPreferences.maxPrice) || 101;
            if (itemPrice >= minPrice && itemPrice <= maxPrice) {
              matchScore += 10;
            }

            return { 
              ...item, 
              matchScore,
              // Ensure required fields exist
              id: item.id || Math.random().toString(36).substring(7),
              isFavorite: item.isFavorite || false
            };
          });

          // Sort by match score (show highest matches first)
          recommendedTiffins.sort((a, b) => b.matchScore - a.matchScore);
        }

        setLocalTiffinData(recommendedTiffins);
        setError(null);
      } catch (err) {
        console.error('Recommendation loading error:', err);
        setError(err.message || 'Failed to load recommendations');
        setLocalTiffinData([]);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadRecommendations();
  }, [userPreferences]);

  const handleFavoriteToggle = (id) => {
    setLocalTiffinData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredTiffins = localTiffinData.filter(item => {
    if (!item) return false;
    
    // 1. Apply price range filter
    const itemPrice = parseFloat(item.price) || 0;
    if (itemPrice < priceRange[0] || itemPrice > priceRange[1]) {
      return false;
    }

    // 2. Apply selected filters (if any)
    if (selectedFilters.length > 0 && item.tags) {
      const hasAllFilters = selectedFilters.every(filter => 
        item.tags.includes(filter)
      );
      if (!hasAllFilters) return false;
    }

    // 3. Apply dietary preferences (if any)
    if (localDietaryPreferencesOptions.length > 0 && item.dietaryOptions) {
      const hasAllDietary = localDietaryPreferencesOptions.every(pref => 
        item.dietaryOptions.includes(pref)
      );
      if (!hasAllDietary) return false;
    }

    // 4. Apply cuisine filters (if any)
    if (localCuisines.length > 0 && item.cuisine) {
      const hasAnyCuisine = localCuisines.some(cuisine => 
        item.cuisine.includes(cuisine)
      );
      if (!hasAnyCuisine) return false;
    }

    return true;
  });

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
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
          safeNavigation({
            pathname: '/screens/TiffinDetails',
            params: { id: item.id }
          });
        }}
        onFavoriteToggle={() => handleFavoriteToggle(item.id)}
        isFavorite={item.isFavorite}
        recommendedBadge={item.matchScore > 50} // Only show if good match
      />
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <BackRouting tittle=  "Recommends"/>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF4B3A" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setError(null);
              loadRecommendations();
            }}
          >
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

      {isInitialLoad ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTiffins}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.listContainer,
            filteredTiffins.length === 0 && styles.emptyListContainer
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="restaurant" size={48} color="#757575" />
              <Text style={styles.emptyText}>No matching services found</Text>
              <Text style={styles.emptySubText}>
                {selectedFilters.length > 0 || localDietaryPreferencesOptions.length > 0
                  ? "Try adjusting your filters"
                  : "Update your preferences for better recommendations"}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={['#FF4B3A']}
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
        onReset={() => {
          resetFilters();
          setLocalTiffinData([...tiffinData].filter(Boolean)); // Reset to full dataset
        }}
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

export default RecommendationScreen;