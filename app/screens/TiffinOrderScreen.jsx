import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import TiffinOrderCard from '../../components/TiffinOrderCard';

const SERVER_URL = 'http://10.154.177.16:3000';

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
    <View style={styles.container}>
      {/* Secondary Tabs */}
      <View style={styles.secondaryTabContainer}>
        {secondaryTabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.secondaryTab, secondaryTab === tab.id && styles.activeSecondaryTab]}
            onPress={() => setSecondaryTab(tab.id)}
          >
            <Text style={[styles.secondaryTabText, secondaryTab === tab.id && styles.activeSecondaryTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {initialLoad && loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#08a742" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>Please refresh the page or try again later.</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found!</Text>
          <Text style={styles.emptySubtext}>It looks like you haven't placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filterBookings()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.bookingsList}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#08a742" />
                <Text style={styles.loadingMoreText}>Loading more orders...</Text>
              </View>
            ) : !hasMore && bookings.length > 0 ? (
              <Text style={styles.noMoreOrdersText}>You've seen all your tiffin orders.</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Order #{selectedOrder?._id.slice(-6)}</Text>
              <TouchableOpacity onPress={closeCancelModal} style={styles.closeButton}>
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  secondaryTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  secondaryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSecondaryTab: {
    borderBottomColor: '#08a742',
  },
  secondaryTabText: {
    fontSize: 15,
    color: '#666',
  },
  activeSecondaryTabText: {
    color: '#08a742',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorSubtext: {
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  bookingsList: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flexGrow: 1,
  },
  cancelModalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  cancelReasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  cancelModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalButtonSecondary: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  cancelModalButtonPrimary: {
    backgroundColor: '#E53935',
    marginLeft: 8,
  },
  cancelModalButtonSecondaryText: {
    color: '#666',
    fontWeight: '600',
  },
  cancelModalButtonPrimaryText: {
    color: 'white',
    fontWeight: '600',
  },
  errorMessage: {
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    color: '#08a742',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#666',
  },
  noMoreOrdersText: {
    textAlign: 'center',
    padding: 16,
    color: '#999',
  },
});