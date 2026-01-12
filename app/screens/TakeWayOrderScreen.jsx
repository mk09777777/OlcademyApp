import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TakeawayOrderCard from '../../Card/TakewayCard';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

const SERVER_URL = API_CONFIG.BACKEND_URL;

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

      if (page === 1) {
        setOrders(fetchedOrders);
      } else {
        setOrders(prev => [...prev, ...fetchedOrders]);
      }

      setTotalPages(fetchedTotalPages);
      setCurrentPage(fetchedCurrentPage);
      setHasMore(fetchedCurrentPage < fetchedTotalPages);
    } catch (error) {
      console.error('Error fetching takeaway orders:', error);
      const message = error.response?.status === 404
        ? 'Takeaway orders endpoint not found. Please check the server configuration.'
        : error.response?.data?.message || 'Failed to fetch orders. Please try again.';
      setError(message);
      setHasMore(false);
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

    if (activeTab === 'active') {
      filtered = filtered.filter(order =>
        ['ready', 'accepted', 'preparing'].includes(order.status.toLowerCase())
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(order =>
        ['completed', 'delivered', 'cancelled', 'rejected', 'user_cancel'].includes(order.status.toLowerCase())
      );
    }

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
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#02757A" />
        <Text className="text-sm font-outfit color-gray-600 mt-2">Loading more orders...</Text>
      </View>
    );
  };

  const renderError = () => (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-base font-outfit color-red-600 text-center mb-4">{error}</Text>
      <TouchableOpacity
        className="bg-primary px-6 py-3 rounded-lg"
        onPress={() => fetchOrders(1)}
      >
        <Text className="text-white font-outfit-medium">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderItem = ({ item }) => {
    const restaurantInfo = item.items?.[0]?.sourceEntityId?.restaurantInfo || {};
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-50 mx-4 my-2 px-3 py-2 rounded-lg">
        <Ionicons name="search" size={20} color="#666" className="mr-2" />
        <TextInput
          className="flex-1 text-base font-outfit color-gray-800"
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'all' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('all')}
        >
          <Text className={`text-sm font-outfit-medium ${activeTab === 'all' ? 'color-primary' : 'color-gray-600'}`}>
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'active' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('active')}
        >
          <Text className={`text-sm font-outfit-medium ${activeTab === 'active' ? 'color-primary' : 'color-gray-600'}`}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'past' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('past')}
        >
          <Text className={`text-sm font-outfit-medium ${activeTab === 'past' ? 'color-primary' : 'color-gray-600'}`}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && renderError()}

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#02757A" />
          <Text className="text-base font-outfit color-gray-600 mt-4">Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerClassName="pb-4"
          ListEmptyComponent={
            !error && (
              <View className="flex-1 items-center justify-center p-8">
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  className="w-24 h-24 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-lg font-outfit-medium color-gray-600 text-center">
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