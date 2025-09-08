import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TakeawayOrderCard from '../../Card/TakewayCard';
import axios from 'axios';

const SERVER_URL = 'https://backend-0wyj.onrender.com';

export default function TakeawayOrdersScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (page, tab = activeTab) => {
    if (!hasMore && page !== 1) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orders/menu/user?page=${page}&limit=10`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = response.data;
      // console.log(response.data)
      if (page === 1) {
        setOrders(fetchedOrders);
      } else {
        setOrders(prev => [...prev, ...fetchedOrders]);
      }

      setTotalPages(fetchedTotalPages);
      setCurrentPage(fetchedCurrentPage);
      setHasMore(fetchedCurrentPage < fetchedTotalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders. Please try again.');
      if (error.response?.status === 404) {
        setError('Endpoint not found. Please check the server configuration.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hasMore, activeTab]);

  useEffect(() => {
    fetchOrders(1);
  }, [activeTab, fetchOrders]);

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

  const handleOrderCancelled = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: "user_cancel" } : order
      )
    );
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Apply status filter based on active tab
    if (activeTab === 'active') {
      filtered = filtered.filter(order =>
        ['ready', 'accepted', 'preparing'].includes(order.status)
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(order =>
        ['completed', 'Delivered', 'cancelled', 'rejected', 'user_cancel'].includes(order.status)
      );
    }

    // Apply search filter if any
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

  const renderOrderItem = ({ item }) => {
    const restaurantInfo = item.items?.[0]?.sourceEntityId?.restaurantInfo || {};
     const restaurantInfof = item.items?.[0]?.sourceEntityId
// console.log(restaurantInfof)
    const safeItem = {
      ...item,
      amount: item.totalPrice || 0,
      subtotal: item.subtotal || 0,
      deliveryFee: item.deliveryFee || 0,
      platformFee: item.platformFee || 0,
      gstCharges: item.gstCharges || 0,
      discount: item.discount || 0,
      items: item.items?.map(i => ({
        ...i,
        price: i.price || 0,
        quantity: i.quantity || 1,
        veg: i.foodType === 'veg',
      })) || [],
      image: item.items?.[0]?.sourceEntityId?.image_url || require('../../assets/images/food.jpg'),
      location: restaurantInfo.address || 'Location not specified',
      restaurantname: restaurantInfo.name || 'Restaurant',
      firmId: item.items?.[0]?.sourceEntityId?._id,
      status: item.status || 'Unknown',
      orderDate: item.orderTime || '',
      orderTime: item.orderTime || '',
      deliverTime: item.deliverTime || '',
    };

    return (
      <TakeawayOrderCard
        order={safeItem}
        onToggleFavorite={() => toggleFavorite(item._id)}
        onOrderCancelled={() => handleOrderCancelled(item._id)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Tabs */}
      <View className="flex-row bg-white px-4 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'all' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('all')}
        >
          <Text className={`font-outfit ${activeTab === 'all' ? 'text-primary font-outfit-bold' : 'text-textsecondary'}`}>
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'active' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('active')}
        >
          <Text className={`font-outfit ${activeTab === 'active' ? 'text-primary font-outfit-bold' : 'text-textsecondary'}`}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'past' ? 'border-primary' : 'border-transparent'}`}
          onPress={() => setActiveTab('past')}
        >
          <Text className={`font-outfit ${activeTab === 'past' ? 'text-primary font-outfit-bold' : 'text-textsecondary'}`}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && renderError()}

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF002E" />
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ListEmptyComponent={
            !error && (
              <View className="items-center justify-center p-8">
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  className="w-30 h-30 mb-4 opacity-70"
                  resizeMode="contain"
                />
                <Text className="text-base text-textsecondary font-outfit">
                  {activeTab === 'all'
                    ? 'No orders found'
                    : activeTab === 'active'
                      ? 'No active orders'
                      : 'No past orders'}
                </Text>
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

