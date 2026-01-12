import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import TiffinOrderCard from '../../components/TiffinOrderCard';
import { API_CONFIG } from '../../config/apiConfig';

const SERVER_URL = API_CONFIG.BACKEND_URL;

export default function TiffinOrdersScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const fetchBookings = useCallback(async (page, tab = activeTab) => {
    if (!hasMore && page !== 1) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orders/tiffin/user?page=${page}&limit=10`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = response.data;

      if (page === 1) {
        setBookings(fetchedOrders);
      } else {
        setBookings((prevOrders) => [...prevOrders, ...fetchedOrders]);
      }
      setTotalPages(fetchedTotalPages);
      setHasMore(fetchedCurrentPage < fetchedTotalPages);
      setCurrentPage(fetchedCurrentPage);
    } catch (error) {
      console.error("Error fetching tiffin orders:", error);
      setError(error.response?.data?.message || "Error fetching orders. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, [hasMore, activeTab]);

  useEffect(() => {
    fetchBookings(1);
  }, [activeTab, fetchBookings]);

  const toggleFavorite = async (orderId) => {
    try {
      setBookings(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, fav: !order.fav } : order
        )
      );

      await axios.put(
        `${SERVER_URL}/api/orderFav/${orderId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setBookings(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, fav: !order.fav } : order
        )
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchBookings(currentPage + 1);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
      case 'completed':
        return '#054935';
      case 'payment failed':
      case 'rejected':
      case 'cancelled':
      case 'user_cancel':
        return '#e23744';
      case 'on the way':
        return '#FF002E';
      case 'preparing':
      case 'pending':
        return '#f57c00';
      case 'accept':
        return '#0f8a65';
      default:
        return '#333';
    }
  };

  const getFilteredOrders = () => {
    let filtered = bookings;

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

  const formatDate = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderDetails = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
    setMessage('');
  };

  const handleCancelOrderSubmit = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      setMessage("Please provide a reason for cancellation.");
      return;
    }

    setMessage("");
    setCancellingOrderId(selectedOrder._id);

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/orders/cancel/${selectedOrder._id}`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(`Order #${selectedOrder._id.slice(-6)} cancelled successfully.`);
        setBookings(prevOrders =>
          prevOrders.map(order =>
            order._id === selectedOrder._id ? { ...order, status: "user_cancel" } : order
          )
        );
        closeOrderDetails();
      } else {
        setMessage(`Failed to cancel order: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setMessage(`Error cancelling order: ${err.response?.data?.message || err.message || 'An unknown error occurred.'}`);
    } finally {
      setCancellingOrderId(null);
      closeCancelModal();
    }
  };

  const calculateProgress = (order) => {
    const totalDaysInPlan = parseInt(order.items?.[0]?.selectedPlan?.name, 10) || 0;
    if (totalDaysInPlan <= 0) {
      return { progress: 0, deliveredDays: 0 };
    }

    const start = new Date(order.items[0].startDate);
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveredCount = order.subStatus?.filter(s => {
      const deliveryDate = new Date(s.date);
      deliveryDate.setHours(0, 0, 0, 0);
      return s.statue === "delivered" && deliveryDate >= start && deliveryDate <= today;
    }).length || 0;

    let progress = (deliveredCount / totalDaysInPlan) * 100;
    progress = Math.min(100, Math.max(0, progress));

    return {
      progress: progress,
      deliveredDays: deliveredCount,
      totalDays: totalDaysInPlan,
      daysRemaining: Math.max(0, totalDaysInPlan - deliveredCount)
    };
  };

  const renderOrderItem = ({ item }) => (
    <TiffinOrderCard
      item={item}
      formatDate={formatDate}
      formatTime={formatTime}
      getStatusColor={getStatusColor}
      onToggleFavorite={() => toggleFavorite(item._id)}
      selectedOrder={selectedOrder}
      showOrderModal={showOrderModal}
      closeOrderDetails={closeOrderDetails}
      openCancelModal={openCancelModal}
      calculateProgress={calculateProgress}
      onPress={() => openOrderDetails(item)}
    />
  );

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

      {/* Orders List */}
      {initialLoad && loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#02757A" />
          <Text className="text-base font-outfit color-gray-600 mt-4">Loading your orders...</Text>
        </View>
      ) : error ? (
        <View className="p-5 bg-red-50 m-5 rounded-lg items-center">
          <Text className="text-base font-outfit-bold color-red-700 mb-1">{error}</Text>
          <Text className="text-sm font-outfit color-gray-600">Please refresh the page or try again later.</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerClassName="p-2.5 pb-20"
          ListEmptyComponent={
            !error && (
              <View className="items-center justify-center p-8">
                <Text className="text-base font-outfit color-gray-600 text-center">
                  {activeTab === 'all'
                    ? 'No orders found'
                    : activeTab === 'active'
                      ? 'No active orders'
                      : 'No past orders'}
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            loading ? (
              <View className="p-4 items-center">
                <ActivityIndicator size="small" color="#02757A" />
                <Text className="text-sm font-outfit color-gray-600 mt-2">Loading more orders...</Text>
              </View>
            ) : !hasMore && bookings.length > 0 ? (
              <Text className="text-center p-4 text-sm font-outfit color-gray-600">You've seen all your tiffin orders.</Text>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Cancel Order Modal */}
      <Modal
        visible={showCancelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCancelModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-3 w-11/12 max-h-4/5 p-4">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
              <Text className="text-xl font-outfit-bold color-gray-800">Cancel Order #{selectedOrder?._id.slice(-6)}</Text>
              <TouchableOpacity onPress={closeCancelModal} className="p-1">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mt-3">
              <Text className="text-base font-outfit color-gray-800 mb-3">
                Please provide a reason for cancelling this order:
              </Text>

              <TextInput
                className="border border-gray-200 rounded-lg p-3 text-sm font-outfit color-gray-800 min-h-25 mb-3"
                multiline
                numberOfLines={4}
                placeholder="e.g., Change of plans, moving, received wrong order, etc."
                value={cancelReason}
                onChangeText={setCancelReason}
                style={{ textAlignVertical: 'top' }}
              />

              {message ? (
                <Text className={`text-sm font-outfit mb-3 text-center ${message.includes('successfully') ? 'color-green-600' : 'color-red-600'}`}>
                  {message}
                </Text>
              ) : null}

              <View className="flex-row justify-between mt-3">
                <TouchableOpacity
                  className="flex-1 p-3 rounded-lg items-center mx-1 bg-gray-100 border border-gray-200"
                  onPress={closeCancelModal}
                >
                  <Text className="text-base font-outfit color-gray-800">Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg items-center mx-1 ${!cancelReason.trim() || cancellingOrderId === selectedOrder?._id ? 'bg-gray-300' : 'bg-red-600'}`}
                  onPress={handleCancelOrderSubmit}
                  disabled={!cancelReason.trim() || cancellingOrderId === selectedOrder?._id}
                >
                  {cancellingOrderId === selectedOrder?._id ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-base font-outfit-bold text-white">Submit Cancellation</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
