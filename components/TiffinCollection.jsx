import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert,  StyleSheet } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Text, ActivityIndicator, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TiffinCard from '@/components/TiffinCard';
import styles from '@/styles/TiffinCollection';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const Api_url = 'http://192.168.0.101:3000';

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
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" color="#e23845" />
        {/* <Text style={styles.emptyStateMessage}>Loading favorites...</Text> */}
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
    <View style={styles.container}>
      {favoriteTiffins.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="food-off"
            size={48}
            color="#666"
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Favorite Tiffin Services</Text>
          <Text style={styles.emptyStateMessage}>
            You haven't liked any tiffin services yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteTiffins}
          renderItem={renderTiffinCard}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.firmList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

}

