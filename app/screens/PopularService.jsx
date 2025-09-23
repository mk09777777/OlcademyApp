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
import { useSafeNavigation } from '@/hooks/navigationPage';
const { width } = Dimensions.get('window');

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

errorDetail: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  marginTop: 8,
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

resetButton: {
  backgroundColor: '#f5f5f5',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 20,
  marginTop: 16,
}

resetButtonText: {
  color: '#333',
  fontSize: 14,
  fontWeight: '500',
}

fullWidthCard: {
  width: '100%',
  marginBottom: 16,
}

verticalListContainer: {
  padding: 20,
}
=== END CSS REFERENCE ===
*/

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
    <View className="w-full mb-4">
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
      <SafeAreaView className="flex-1 bg-white p-5">
        <BackRouting tittle = "Popular Service"/>
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text className="mt-3 text-base font-bold text-gray-800">Loading popular services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white p-5">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center p-5">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4B3A" />
          <Text className="text-lg font-bold text-gray-800 text-center mt-4">Failed to load popular services</Text>
          <Text className="text-sm text-gray-600 text-center mt-2">{error.message || 'Please try again later'}</Text>
          <TouchableOpacity 
            className="bg-red-500 px-6 py-3 rounded-lg mt-4" 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Retry</Text>
            )}
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

      {filteredTiffins.length === 0 && !isRefreshing ? (
        <View className="flex-1 justify-center items-center p-5">
          <MaterialCommunityIcons name="silverware" size={48} color="#757575" />
          <Text className="text-lg font-bold text-gray-800 text-center mt-4">No popular tiffin services found</Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            {searchQuery || selectedFilters.length > 0 
              ? "Try adjusting your search or filters" 
              : "There might be no services available right now"}
          </Text>
          <TouchableOpacity 
            className="bg-gray-100 px-5 py-2.5 rounded-full mt-4"
            onPress={() => {
              setSearchQuery('');
              resetFilters();
            }}
          >
            <Text className="text-gray-800 text-sm font-medium">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTiffins}
          renderItem={renderServiceItem}
          keyExtractor={item => item.Title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 20}}
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