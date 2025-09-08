import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import TiffinOrderCard from '../../components/TiffinOrderCard';

const SERVER_URL = 'https://backend-0wyj.onrender.com';

export default function TiffinOrdersScreen() {
  const [primaryTab, setPrimaryTab] = useState('All');
  const [secondaryTab, setSecondaryTab] = useState('all');
  const [loading, setLoading] = useState(true);
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

  const fetchBookings = useCallback(async (page) => {
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
      setError("Error fetching orders. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

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
        return '#054935ff';
      case 'payment failed':
      case 'rejected':
      case 'cancelled':
      case 'user_cancel':
        return '#e23744';
      case 'on the way':
        return '#fc8019';
      case 'preparing':
      case 'pending':
        return '#f57c00';
      case 'accept':
        return '#0f8a65';
      default:
        return '#333';
    }
  };

  const primaryTabs = [
    { id: 'All', label: 'All Orders' },
    { id: 'One Day', label: 'One Day' },
    { id: 'Weekly', label: 'Weekly' },
    { id: 'Monthly', label: 'Monthly' }
  ];

  const secondaryTabs = [
    { id: 'all', label: 'All' },
    { id: 'notaccept', label: 'Pending' },
    { id: 'accept', label: 'Active' },
    { id: 'completed', label: 'Completed', statuses: ['completed', 'user_cancel'] }
  ];

  const filterBookings = () => {
    let filtered = primaryTab === 'All'
      ? bookings
      : bookings.filter(booking => {
        const planType = booking.items?.[0]?.selectedPlan?.name || '';
        if (primaryTab === 'One Day') return planType.includes('1');
        if (primaryTab === 'Weekly') return planType.includes('7');
        if (primaryTab === 'Monthly') return planType.includes('30');
        return true;
      });

    if (secondaryTab !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === secondaryTab);
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
      onToggleFavorite={toggleFavorite}
      selectedOrder={selectedOrder}
      showOrderModal={showOrderModal}
      closeOrderDetails={closeOrderDetails}
      openCancelModal={openCancelModal}
      calculateProgress={calculateProgress}
      onPress={() => openOrderDetails(item)}
    />
  );

  return (
    <View className="p-2.5 flex-1 bg-background">
      {/* Secondary Tabs */}
      <View className="flex-row bg-white px-3 py-2.5 border-b border-border">
        {secondaryTabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 items-center py-2 border-b-2 ${secondaryTab === tab.id ? 'border-primary' : 'border-transparent'}`}
            onPress={() => setSecondaryTab(tab.id)}
          >
            <Text className={`text-sm ${secondaryTab === tab.id ? 'text-primary font-outfit-bold' : 'text-textsecondary font-outfit'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {initialLoad && loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF002E" />
          <Text className="mt-2.5 text-textsecondary font-outfit">Loading your orders...</Text>
        </View>
      ) : error ? (
        <View className="p-5 bg-red-50 m-5 rounded-lg items-center">
          <Text className="text-red-800 font-outfit-bold mb-1">{error}</Text>
          <Text className="text-textsecondary text-xs font-outfit">Please refresh the page or try again later.</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View className="items-center justify-center p-10">
          <Text className="text-base text-textsecondary mb-2 font-outfit-bold">No orders found!</Text>
          <Text className="text-sm text-textsecondary font-outfit">It looks like you haven't placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filterBookings()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
          ListFooterComponent={
            loading ? (
              <View className="p-4 items-center">
                <ActivityIndicator size="small" color="#FF002E" />
                <Text className="mt-2 text-textsecondary font-outfit">Loading more orders...</Text>
              </View>
            ) : !hasMore && bookings.length > 0 ? (
              <Text className="text-center p-4 text-textsecondary font-outfit">You've seen all your tiffin orders.</Text>
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
          <View className="bg-white rounded-lg w-11/12 max-h-4/5 p-4">
            <View className="flex-row justify-between items-center mb-4 border-b border-border pb-3">
              <Text className="text-xl font-outfit-bold text-textprimary">Cancel Order #{selectedOrder?._id.slice(-6)}</Text>
              <TouchableOpacity onPress={closeCancelModal} className="p-1">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.cancelModalText}>
                Please provide a reason for cancelling this order:
              </Text>

              <TextInput
                style={styles.cancelReasonInput}
                multiline
                numberOfLines={4}
                placeholder="e.g., Change of plans, moving, received wrong order, etc."
                value={cancelReason}
                onChangeText={setCancelReason}
              />

              {message ? (
                <Text style={message.includes('successfully') ? styles.successMessage : styles.errorMessage}>
                  {message}
                </Text>
              ) : null}

              <View style={styles.cancelModalButtons}>
                <TouchableOpacity
                  style={[styles.cancelModalButton, styles.cancelModalButtonSecondary]}
                  onPress={closeCancelModal}
                >
                  <Text style={styles.cancelModalButtonSecondaryText}>Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelModalButton, styles.cancelModalButtonPrimary]}
                  onPress={handleCancelOrderSubmit}
                  disabled={!cancelReason.trim() || cancellingOrderId === selectedOrder?._id}
                >
                  {cancellingOrderId === selectedOrder?._id ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.cancelModalButtonPrimaryText}>Submit Cancellation</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

