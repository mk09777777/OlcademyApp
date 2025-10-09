import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
 
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackRouting from '@/components/BackRouting';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import { FilterModal } from '../../components/FilterModal';
import useTiffinHome from '../../hooks/useTiffinHome';
import { usePreferences } from '../../context/PreferencesContext';
import SearchBar from '../../components/SearchBar';
import tiffinData from '../../Data/tiffin.json';
import { useSafeNavigation } from '@/hooks/navigationPage';

/*
=== ORIGINAL CSS REFERENCE ===
container: {
  flex: 1,
  backgroundColor: 'white',
  padding: 20,
}

header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
}

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

loadingText: {
  marginTop: 12,
  fontFamily: 'outfit-bold',
  fontSize: 16,
  color: '#333',
}

errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
}

errorText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginTop: 16,
}

retryButton: {
  backgroundColor: '#FF4B3A',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 8,
  marginTop: 16,
}

retryButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
}

serviceCard: {
  marginBottom: 16,
}

listContainer: {
  padding: 20,
}

emptyListContainer: {
  flex: 1,
  justifyContent: 'center',
}

emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
}

emptyText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginTop: 16,
}

emptySubText: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  marginTop: 8,
}
=== END CSS REFERENCE ===
*/
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
    <View className="mb-4">
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
      <SafeAreaView className="flex-1 bg-white p-5">
        <BackRouting tittle=  "Recommends"/>
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center p-5">
          <MaterialIcons name="error-outline" size={48} color="#FF4B3A" />
          <Text className="text-lg font-bold text-gray-800 text-center mt-4">{error}</Text>
          <TouchableOpacity 
            className="bg-red-500 px-6 py-3 rounded-lg mt-4" 
            onPress={() => {
              setError(null);
              loadRecommendations();
            }}
          >
            <Text className="text-white text-base font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <StatusBar barStyle="dark-content" />
    <View className="flex-row items-center px-5 py-2.5">
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text className="mt-3 text-base font-bold text-gray-800">Loading recommendations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTiffins}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            {padding: 20},
            filteredTiffins.length === 0 && {flex: 1, justifyContent: 'center'}
          ]}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-5">
              <MaterialIcons name="restaurant" size={48} color="#757575" />
              <Text className="text-lg font-bold text-gray-800 text-center mt-4">No matching services found</Text>
              <Text className="text-sm text-gray-600 text-center mt-2">
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