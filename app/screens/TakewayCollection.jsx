import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { styles } from '../../styles/TakewayCollection';
import FirmCard from '../../components/FirmCard';
import { useBookmarkManager } from '../../hooks/BookMarkmanger';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from '@/components/BackRouting';
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
      const response = await axios.get('http://192.168.0.101:3000/firm/get-all/restaurants');
      
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e23845" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackRouting tittle ="Bookmarks"/>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dishes' && styles.activeTab]}
          onPress={() => setActiveTab('dishes')}
        >
          <Text style={[styles.tabText, activeTab === 'dishes' && styles.activeTabText]}>
            Dishes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Restaurants
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'dishes' ? (
          <View style={styles.restaurantsContainer}>
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
              <Text style={styles.noResultsText}>No dishes found in your collection.</Text>
            )}
          </View>
        ) : (
          <View style={styles.restaurantsContainer}>
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
              <Text style={styles.noResultsText}>No restaurants added to your collection yet.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TakewayCollection;