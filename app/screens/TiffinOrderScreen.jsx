import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FilterModal from '../../Model/fillter';
import axios from 'axios';
const SERVER_URL = 'http://192.168.0.100:3000';

export default function TiffinOrdersScreen() {
  const [primaryTab, setPrimaryTab] = useState('All');
  const [secondaryTab, setSecondaryTab] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const observer = useRef();

  const fetchBookings = useCallback(async (page) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orders/tiffin/user?page=${page}&limit=10`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, totalPages, currentPage: fetchedCurrentPage } = response.data;
      console.log('sgdsd', response.data);

      if (page === 1) {
        setBookings(fetchedOrders);
      } else {
        setBookings((prevOrders) => [...prevOrders, ...fetchedOrders]);
      }

      setHasMore(fetchedCurrentPage < totalPages);
      setCurrentPage(fetchedCurrentPage);
    } catch (error) {
      console.error("Error fetching tiffin orders:", error);
      setError("Error fetching orders. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  const primaryTabs = [
    { id: 'All', label: 'All Orders' },
    { id: 'One Day', label: 'One Day' },
    { id: 'Weekly', label: 'Weekly' },
    { id: 'Monthly', label: 'Monthly' }
  ];

  const secondaryTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
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

  const renderOrderItem = ({ item, index }) => {
    const firstItem = item.items && item.items.length > 0 ? item.items[0] : {};
    const tiffinName = firstItem.sourceEntityId?.kitchenName || firstItem.name || "Unknown Tiffin Service";
    const tiffinImage = firstItem.img || "https://placehold.co/150x150/e0f2f7/00796b?text=Tiffin";
    const mealType = firstItem.mealType?.name || "Tiffin Meal";

    return (
      <TouchableOpacity
        style={[styles.orderCard, selectedOrder?._id === item._id && styles.selectedOrderCard]}
        onPress={() => openOrderDetails(item)}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: tiffinImage }}
            style={styles.cardImage}
            onError={() => console.log("Image load error")}
          />
          <View style={[styles.statusBadge,
          item.status === 'delivered' ? styles.deliveredBadge :
            item.status === 'pending' ? styles.pendingBadge :
              item.status === 'active' ? styles.activeBadge :
                item.status === 'user_cancel' ? styles.cancelledBadge :
                  styles.defaultBadge
          ]}>
            <Text style={styles.statusBadgeText}>
              {item.status === 'ready' ? "Plan Complete" : item.status}
            </Text>
          </View>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>OrderId:- {item._id}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.tiffinName}>{tiffinName}</Text>
          <Text style={styles.mealType}>{mealType}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.priceText}>${item.totalPrice?.toFixed(2)}</Text>
            <TouchableOpacity style={styles.viewDetailsButton} onPress={() => openOrderDetails(item)}>
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterButtonsContainer}
        >
          {primaryTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterButton, primaryTab === tab.id && styles.activeFilterButton]}
              onPress={() => setPrimaryTab(tab.id)}
            >
              <Text style={[styles.filterButtonText, primaryTab === tab.id && styles.activeFilterButtonText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.filterIconButton} onPress={() => setShowFilter(true)}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

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
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          visible={showOrderModal}
          animationType="slide"
          transparent={true}
          onRequestClose={closeOrderDetails}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Order Details</Text>
                  <TouchableOpacity onPress={closeOrderDetails} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Order Summary Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="restaurant-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>
                      {selectedOrder.items?.[0]?.sourceEntityId?.kitchenName || "Unknown Tiffin Service"}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>
                      {formatDate(selectedOrder.orderTime)} at {formatTime(selectedOrder.orderTime)}
                    </Text>
                  </View>
                  {selectedOrder.phone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call" size={18} color="#666" />
                      <Text style={styles.infoText}>{selectedOrder.phone.number || 'N/A'}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{selectedOrder.address || "N/A"}</Text>
                  </View>
                  {selectedOrder.specialInstructions && (
                    <View style={styles.specialInstructionsContainer}>
                      <View style={styles.instructionHeader}>
                        <MaterialCommunityIcons name="information-outline" size={20} color="gray" style={styles.icon} />
                        <Text style={styles.instructionTitle}>Special Instructions:</Text>
                      </View>
                      <Text style={styles.instructionText}>{selectedOrder.specialInstructions}</Text>
                    </View>
                  )}
                </View>

                {/* Order Items Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.foodType && <Text style={styles.itemName}>{item.foodType}</Text>}
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemDetail}>Qty: {item.quantity}</Text>
                        {item.mealType?.name && (
                          <Text style={styles.itemDetail}>Meal: {item.mealType.name}</Text>
                        )}
                        {item.selectedPlan?.name && (
                          <Text style={styles.itemDetail}>Plan: {item.selectedPlan.name}</Text>
                        )}
                        {selectedOrder.deliverTime && (
                          <Text style={styles.itemDetail}>DeliverTime: {selectedOrder.deliverTime}</Text>
                        )}
                      </View>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                {selectedOrder.items?.[0]?.startDate && (
                  <View style={styles.progressSection}>
                    <Text style={styles.sectionTitle}>Subscription Progress</Text>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { width: `${calculateProgress(selectedOrder).progress}%` }]} />
                    </View>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressText}>
                        {calculateProgress(selectedOrder).deliveredDays} days delivered
                      </Text>
                      <Text style={styles.progressPercent}>
                        {calculateProgress(selectedOrder).progress.toFixed(0)}% complete
                      </Text>
                    </View>
                  </View>
                )}

                {/* Payment Summary Section */}
                <View style={styles.paymentSection}>
                  <Text style={styles.paymentTitle}>Payment Summary:</Text>

                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Subtotal:</Text>
                      <Text style={styles.paymentValue}>${selectedOrder.subtotal?.toFixed(2)}</Text>
                    </View>

                    {selectedOrder.deliveryFee > 0 && (
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Delivery Fee:</Text>
                        <Text style={styles.paymentValue}>${selectedOrder.deliveryFee?.toFixed(2)}</Text>
                      </View>
                    )}

                    {selectedOrder.gstCharges > 0 && (
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>GST Charges:</Text>
                        <Text style={styles.paymentValue}>${selectedOrder.gstCharges?.toFixed(2)}</Text>
                      </View>
                    )}

                    {selectedOrder.platformFee > 0 && (
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Platform Fee:</Text>
                        <Text style={styles.paymentValue}>${selectedOrder.platformFee?.toFixed(2)}</Text>
                      </View>
                    )}

                    {Array.isArray(selectedOrder?.totalOtherCharges) && selectedOrder.totalOtherCharges.length > 0 && (
                      <View>
                        {selectedOrder.totalOtherCharges.map((charge, idx) => (
                          <View key={idx} style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>{charge.name || 'Additional Charge'}:</Text>
                            <Text style={styles.paymentValue}>${charge.amount?.toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.paymentRow}>
                      <Text style={[styles.paymentLabel, styles.discountText]}>Discount:</Text>
                      <Text style={[styles.paymentValue, styles.discountText]}>- ${selectedOrder.discount?.toFixed(2)}</Text>
                    </View>

                    <View style={styles.totalPaymentRow}>
                      <Text style={styles.totalPaymentLabel}>Total Paid:</Text>
                      <Text style={styles.totalPaymentValue}>${selectedOrder.totalPrice?.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                {/* Order Timeline Section */}
                {selectedOrder.subStatus?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Timeline</Text>
                    <View style={styles.timeline}>
                      {selectedOrder.subStatus
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((status, index) => (
                          <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineDot}>
                              {status.statue === "delivered" ? (
                                <Ionicons name="checkmark" size={12} color="#08a742" />
                              ) : (
                                <Ionicons name="time" size={12} color="#FFA500" />
                              )}
                            </View>
                            <View style={styles.timelineContent}>
                              <Text style={styles.timelineStatus}>
                                {status.statue}
                                {index === selectedOrder.subStatus.length - 1 && (
                                  <Text style={styles.latestBadge}> Latest</Text>
                                )}
                              </Text>
                              <Text style={styles.timelineDate}>
                                {formatDate(status.date)} at {formatTime(status.date)}
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>
                  </View>
                )}

                {/* Cancellation Reason (if order is cancelled) */}
                {selectedOrder.status === 'user_cancel' && selectedOrder.cancellationReason && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancellation Details</Text>
                    <View style={styles.infoRow}>
                      <Ionicons name="alert-circle-outline" size={20} color="#666" />
                      <Text style={styles.infoText}>Reason: {selectedOrder.cancellationReason}</Text>
                    </View>
                    {selectedOrder.cancelledAt && (
                      <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                          Cancelled on: {formatDate(selectedOrder.cancelledAt)} at {formatTime(selectedOrder.cancelledAt)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Cancel Order Button (if order is cancellable) */}
                {selectedOrder.status !== 'preparing' &&
                  selectedOrder.status !== 'pending' &&
                  selectedOrder.status !== 'ready' &&
                  selectedOrder.status !== 'rejected' &&
                  selectedOrder.status !== 'user_cancel' && (
                    <View style={styles.cancelButtonContainer}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={openCancelModal}
                      >
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </ScrollView>
            </View>
          </View>
        </Modal>
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

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(newFilters) => {
          setShowFilter(false);
        }}
      />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButtonsContainer: {
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilterButton: {
    backgroundColor: '#e6f7ee',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#08a742',
  },
  filterIconButton: {
    paddingHorizontal: 16,
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
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSecondaryTab: {
    borderBottomColor: '#08a742',
  },
  secondaryTabText: {
    fontSize: 14,
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
    padding: 16,
    paddingBottom: 80,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOrderCard: {
    borderWidth: 2,
    borderColor: '#08a742',
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  deliveredBadge: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  activeBadge: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  cancelledBadge: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  defaultBadge: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderIdBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderIdText: {
    fontSize: 12,
    color: '#666',
  },
  cardContent: {
    padding: 16,
  },
  tiffinName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  mealType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetailsButton: {
    backgroundColor: '#08a742',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: 'white',
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
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
  specialInstructionsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
    width: '100%'
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  instructionTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  instructionText: {
    fontStyle: 'italic',
    marginLeft: 30,
    color: '#4b5563'
  },
  icon: {
    marginRight: 8
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  progressSection: {
    backgroundColor: '#E0F7FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#B2EBF2',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00ACC1',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00838F',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  orderItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#08a742',
    marginTop: 4,
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  paymentDetails: {
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
  },
  discountText: {
    color: '#E53935',
  },
  totalPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPaymentLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPaymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#08a742',
  },
  timeline: {
    marginLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#BDBDBD',
    paddingLeft: 20,
  },
  timelineItem: {
    marginBottom: 16,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -26,
    top: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#08a742',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContent: {
    paddingBottom: 8,
  },
  timelineStatus: {
    fontWeight: '600',
    marginBottom: 4,
  },
  latestBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#757575',
  },
  cancelButtonContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
});