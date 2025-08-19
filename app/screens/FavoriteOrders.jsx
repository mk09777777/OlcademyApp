import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/FavoriteOrder';
import axios from 'axios';
import TakeawayOrderCard from '../../Card/TakewayCard'; // Add this import

const SERVER_URL = 'http://192.168.0.102:3000';

export default function FavoriteOrdersScreen() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (page) => {
    if (!hasMore && page !== 1) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orderFav?page=${page}&limit=10`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = response.data;

      if (page === 1) {
        setOrders(fetchedOrders);
      } else {
        setOrders(prev => [...prev, ...fetchedOrders]);
      }
      
      setTotalPages(fetchedTotalPages);
      setCurrentPage(fetchedCurrentPage);
      setHasMore(fetchedCurrentPage < fetchedTotalPages);
    } catch (error) {
      console.error('Error fetching favorite orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch favorite orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hasMore]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchOrders(currentPage + 1);
    }
  };

  const toggleFavorite = async (orderId) => {
    try {
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, fav: !order.fav } : order
      );
      setOrders(updatedOrders);

      await axios.put(
        `${SERVER_URL}/api/orderFav/${orderId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert if error
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, fav: !order.fav } : order
      ));
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (searchQuery) {
      filtered = filtered.filter(order => {
        const restaurantName = order.items[0]?.sourceEntityId?.restaurantInfo?.name || '';
        return (
          restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }
    
    return filtered;
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#fc8019" />
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => fetchOrders(1)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Prepare order data for TakeawayOrderCard
  const prepareOrderData = (order) => {
    const restaurantInfo = order.items?.[0]?.sourceEntityId?.restaurantInfo || {};
    return {
      ...order,
      restaurantname: restaurantInfo.name || 'Restaurant',
      location: restaurantInfo.address || 'Location not specified',
      image: order.items?.[0]?.sourceEntityId?.image_url || require('../../assets/images/food.jpg'),
      orderDate: order.orderTime ? new Date(order.orderTime).toLocaleDateString() : new Date().toLocaleDateString(),
      status: order.status || 'Unknown',
      amount: order.totalPrice || 0,
      items: order.items?.map(item => ({
        ...item,
        veg: item.veg || false, // Default to false if not specified
        quantity: item.quantity || 1,
        price: item.price || 0
      })) || [],
      fav: order.fav || false
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by restaurant or dish"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View> */}

      {/* Error Display */}
      {error && renderError()}

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fc8019" />
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={({ item }) => (
            <TakeawayOrderCard 
              order={prepareOrderData(item)} 
              onToggleFavorite={() => toggleFavorite(item._id)}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.ordersList}
          ListEmptyComponent={
            !error && (
              <View style={styles.emptyContainer}>
                <Image 
                  source={require('../../assets/images/logo.jpg')} 
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyText}>No favorite orders found</Text>
              </View>
            )
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}