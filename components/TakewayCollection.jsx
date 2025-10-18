import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/TakewayCollection';
import FirmCard from './FirmCard';
import { API_CONFIG } from '../config/apiConfig';
import { useRouter } from 'expo-router';
import axios from 'axios';

const TakewayCollection = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const router = useRouter();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/firm/user/liked-restaurants`, {
        withCredentials: true,
      });
      console.log(response.data.restaurants)
      setAllRestaurants(response.data.restaurants);
      setError(null);
    } catch (err) {
      setError('Failed to load collection data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDishes = async () => {
    try {

    } catch (err) {
      console.error('Failed to load dishes', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchDishes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#02757A" />
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

  const EmptyBookmarkCard = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../assets//images/food.jpg')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptySubtitle}>Save your favorite restaurants and they'll appear here</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View >
        {/* <TouchableOpacity
          style={[styles.tab, activeTab === 'dishes' && styles.activeTab]}
          onPress={() => setActiveTab('dishes')}
        >
          <Text style={[styles.tabText, activeTab === 'dishes' && styles.activeTabText]}>
            Dishes
          </Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Restaurants
          </Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.content}>
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
                    onBookmarkPress={() => handleBookmarkPress(item._id)}
                    onPress={() => router.push(`/dish/${item._id}`)}
                  />
                )}
              />
            ) : (
              <EmptyBookmarkCard />
            )}
          </View>
        ) : (
          <View style={styles.restaurantsContainer}>
            {allRestaurants && allRestaurants.length > 0 ? (
              <FlatList
                data={allRestaurants}
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
                    promoted={item.promoted || false}
                    time={item.time || "N/A"}
                    offB={item.offB || false}
                    proExtraB={item.proExtraB || false}
                    off={item.off || "No offer"}
                    proExtra={item.proExtra || "N/A"}
                    image={item.restaurantInfo.image_urls || item.image_urls}
                    onPress={() => router.push({
                      pathname: "screens/FirmDetailsTakeAway",
                      params: { firmId: item._id }
                    })}
                    offer={item.offer}
                    onBookmark={() => handleBookmarkPress(item._id)}
                    isBookmarked={true}
                  />
                )}
              />
            ) : (
              <EmptyBookmarkCard />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TakewayCollection;