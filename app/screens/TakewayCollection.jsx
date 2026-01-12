import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FirmCard from '../../components/FirmCard';
import { useBookmarkManager } from '../../hooks/BookMarkmanger';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from '@/components/BackRouting';
import { API_CONFIG } from '../../config/apiConfig';

const TakewayCollection = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const { safeNavigation } = useSafeNavigation();
  const { toggleBookmark, isBookmarked, bookmarks } = useBookmarkManager();
  const router = useRouter();

  useEffect(() => {
    fetchRestaurants();
  }, [bookmarks]); // Add bookmarks as dependency to refresh when bookmarks change

  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/firm/get-all/restaurants`);
      
      if (response.data && response.data.data) {
        // Update isBookMarked property for each restaurant
        const restaurantsWithBookmarkStatus = response.data.data.map(restaurant => ({
          ...restaurant,
          restaurantInfo: {
            ...restaurant.restaurantInfo,
            isBookMarked: isBookmarked(restaurant._id, 'restaurants')
          }
        }));
        setAllRestaurants(restaurantsWithBookmarkStatus);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load collection data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bookmarkedRestaurants = allRestaurants.filter(restaurant => 
    isBookmarked(restaurant._id, 'restaurants')
  );

  const handleBookmarkPress = (firmId) => {
    if (firmId) {
      toggleBookmark(firmId, 'restaurants');
      // Update local state to reflect the change immediately
      setAllRestaurants(prev => prev.map(restaurant => {
        if (restaurant._id === firmId) {
          return {
            ...restaurant,
            restaurantInfo: {
              ...restaurant.restaurantInfo,
              isBookMarked: !restaurant.restaurantInfo.isBookMarked
            }
          };
        }
        return restaurant;
      }));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#e23845" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg font-outfit-bold color-red-600 text-center mb-4">{error}</Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg" onPress={fetchRestaurants}>
          <Text className="text-white font-outfit-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting tittle ="Bookmarks"/>
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'dishes' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('dishes')}
        >
          <Text className={`text-sm font-outfit-medium ${activeTab === 'dishes' ? 'color-primary' : 'color-gray-600'}`}>
            Dishes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'restaurants' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text className={`text-sm font-outfit-medium ${activeTab === 'restaurants' ? 'color-primary' : 'color-gray-600'}`}>
            Restaurants
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {activeTab === 'dishes' ? (
          <View className="p-4">
            {dishes && dishes.length > 0 ? (
              <FlatList
                data={dishes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <DishCard
                    dish={item}
                    isBookmarked={isBookmarked(item._id, 'dishes')}
                    onBookmarkPress={() => toggleBookmark(item._id, 'dishes')}
                    onPress={() => safeNavigation(`/dish/${item._id}`)}
                  />
                )}
              />
            ) : (
              <Text className="text-lg font-outfit-medium color-gray-600 text-center mt-8">No dishes found in your collection.</Text>
            )}
          </View>
        ) : (
          <View className="p-4">
            {bookmarkedRestaurants && bookmarkedRestaurants.length > 0 ? (
              <FlatList
                data={bookmarkedRestaurants}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <FirmCard
                    firmId={item._id}
                    restaurantInfo={item.restaurantInfo}
                    firmName={item.restaurantInfo.name}
                    area={item.restaurantInfo.address}
                    rating={item.restaurantInfo.ratings?.overall}
                    cuisines={item.restaurantInfo.cuisines}
                    price={item.restaurantInfo.priceRange}
                    image={item.restaurantInfo.image_urls}
                    onPress={() => safeNavigation({
                      pathname: "screens/FirmDetailsTakeAway",
                      params: { firmId: item._id }
                    })}
                    offer={item.offer}
                    onBookmark={() => handleBookmarkPress(item._id)}
                    isBookmarked={isBookmarked(item._id, 'restaurants')}
                  />
                )}
              />
            ) : (
              <Text className="text-lg font-outfit-medium color-gray-600 text-center mt-8">No restaurants added to your collection yet.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = {
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#e23845', marginBottom: 16 },
  retryButton: { backgroundColor: '#e23845', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#e23845' },
  tabText: { fontSize: 14, color: '#666', fontFamily: 'outfit-medium' },
  activeTabText: { color: '#e23845', fontFamily: 'outfit-bold' },
  content: { flex: 1 },
  restaurantsContainer: { padding: 16 },
  noResultsText: { fontSize: 16, fontFamily: 'outfit-medium', color: '#666', textAlign: 'center', marginTop: 32 }
};
*/

export default TakewayCollection;