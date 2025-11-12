import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TiffinCard from '@/components/TiffinCard';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

import { API_CONFIG } from '../config/apiConfig';
const Api_url = API_CONFIG.BACKEND_URL;

export default function TiffinCollection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [favoriteTiffins, setFavoriteTiffins] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    const fetchInitialFavorites = async () => {
      if (!isAuthenticated || !user?.id) {
        Alert.alert('Login Required', 'Please login to view favorites');
        return;
      }

      try {
        setLoadingFavorites(true);
        const response = await axios.get(`${Api_url}/api/tiffins/liked`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });

        console.log('Favorites API response:', response.data);
        
        // Handle the response format with likedTiffins array
        if (response.data && response.data.likedTiffins && Array.isArray(response.data.likedTiffins)) {
          setFavoriteTiffins(response.data.likedTiffins);
        } else {
          console.warn('Unexpected API response format:', response.data);
          Alert.alert('Error', 'Unexpected data format received');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Failed to load favorites');
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchInitialFavorites();
  }, [isAuthenticated, user?.id]);

  if (loadingFavorites) {
    return (
      <View className="flex-1 items-center justify-center p-10">
        <ActivityIndicator size="large" color="#02757A" />
        {/* <Text className="text-base font-outfit color-gray-600 text-center mt-4">Loading favorites...</Text> */}
      </View>
    );
  }

  const renderTiffinCard = ({ item }) => (
    <TiffinCard
      firm={{
        id: item._id || item.id,
        image: item.images?.[0] || require('../assets/images/food1.jpg'),
        title: item.kitchenName || 'Unknown',
        rating: item.ratings || 0,
        priceRange: item.charges?.[0]?.price || 'N/A',
        mealTypes: item.category || [],
        deliveryCities: item.deliveryCity || [],
      }}
      onPress={() => {
        router.push({
          pathname: '/screens/TiffinDetails',
          params: { tiffinId: item._id || item.id }
        });
      }}
      isFavorite={true} // Since this is the favorites screen, all items are favorites
      onFavoriteToggle={() => {}} // No-op since we can't unfavorite from here
    />
  );

  return (
    <View className="flex-1 bg-white">
      {favoriteTiffins.length === 0 ? (
        <View className="flex-1 items-center justify-center p-10">
          <MaterialCommunityIcons
            name="food-off"
            size={48}
            color="#666"
          />
          <Text className="text-lg font-outfit-medium color-gray-800 mt-4 mb-2">No Favorite Tiffin Services</Text>
          <Text className="text-base font-outfit color-gray-600 text-center">
            You haven't liked any tiffin services yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteTiffins}
          renderItem={renderTiffinCard}
          keyExtractor={item => item._id || item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

}

