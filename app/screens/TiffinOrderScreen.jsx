import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' ? styles.activeTab : null]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' ? styles.activeTabText : null]}>
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' ? styles.activeTab : null]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' ? styles.activeTabText : null]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' ? styles.activeTab : null]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' ? styles.activeTabText : null]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {initialLoad && loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#02757A" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubText}>Please refresh the page or try again later.</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            !error && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
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
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#02757A" />
                <Text style={styles.footerLoadingText}>Loading more orders...</Text>
              </View>
            ) : !hasMore && bookings.length > 0 ? (
              <Text style={styles.noMoreText}>You've seen all your tiffin orders.</Text>
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
          <View style={styles.modalContainer}>
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
                  style={[styles.cancelModalButton, styles.cancelModalButtonPrimary, !cancelReason.trim() || cancellingOrderId === selectedOrder?._id ? styles.disabledButton : null]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'outfit',
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#02757A',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'outfit',
  },
  activeTabText: {
    color: '#02757A',
    fontFamily: 'outfit-bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'outfit',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fee2e2',
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#b91c1c',
    fontFamily: 'outfit-bold',
    marginBottom: 5,
  },
  errorSubText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'outfit',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'outfit',
    textAlign: 'center',
  },
  flatListContent: {
    padding: 10,
    paddingBottom: 80,
  },
  footerLoading: {
    padding: 16,
    alignItems: 'center',
  },
  footerLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'outfit',
  },
  noMoreText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 14,
    color: '#666',
    fontFamily: 'outfit',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'outfit-bold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    marginTop: 12,
  },
  cancelModalText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'outfit',
    marginBottom: 12,
  },
  cancelReasonInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontFamily: 'outfit',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#0f8a65',
    fontFamily: 'outfit',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#e23744',
    fontFamily: 'outfit',
    marginBottom: 12,
    textAlign: 'center',
  },
  cancelModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelModalButtonPrimary: {
    backgroundColor: '#FF002E',
  },
  cancelModalButtonSecondary: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelModalButtonPrimaryText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'outfit-bold',
  },
  cancelModalButtonSecondaryText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'outfit',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});