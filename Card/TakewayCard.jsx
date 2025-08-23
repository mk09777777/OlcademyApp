import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  AntDesign
} from '@expo/vector-icons';
import axios from 'axios';

import { API_CONFIG } from '../config/apiConfig';
const SERVER_URL = API_CONFIG.BACKEND_URL;

const TakeawayOrderCard = ({ order, onToggleFavorite, onOrderCancelled }) => {
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [message, setMessage] = useState('');

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
        return '#0f8a65';
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
      case 'accepted':
        return '#0f8a65';
      default:
        return '#333';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrderSubmit = async () => {
    if (!cancelReason.trim()) {
      setMessage("Please provide a reason for cancellation.");
      return;
    }

    setMessage("");
    setCancellingOrderId(order._id);

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/orders/cancel/${order._id}`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(`Order #${order._id.slice(-6)} cancelled successfully.`);
        order.status = "user_cancel";
        onOrderCancelled(order._id);
        setIsCancelModalVisible(false);
      } else {
        setMessage(`Failed to cancel order: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setMessage(`Error cancelling order: ${err.response?.data?.message || err.message || 'An unknown error occurred.'}`);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const renderPriceDetails = () => {
    return (
      <ScrollView >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headersub}>
            <MaterialIcons name="info" size={24} color="#0D9488" />
            <Text style={styles.headerText}> 
              Order Details  
            </Text> </View>
            <Text style={styles.orderId}>OrderId:-  {order._id}</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                <MaterialCommunityIcons name="store" size={18} color="#3B82F6" /> Restaurant:
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Name: </Text>{order.items[0]?.sourceEntityId?.restaurantInfo?.name || "N/A"}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Address: </Text>{order.items[0]?.sourceEntityId?.restaurantInfo?.address || "N/A"}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                <FontAwesome name="tag" size={18} color="#8B5CF6" /> Order Type:
              </Text>
              <Text style={styles.detailText}>Takeaway</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                <Feather name="clock" size={18} color="#F59E0B" /> Order Placed:
              </Text>
              <Text style={styles.detailText}>{formatDate(order.orderTime)} at {formatTime(order.orderTime)}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                <Feather name="clock" size={18} color="#10B981" /> Scheduled Takeaway Time:
              </Text>
              <Text style={styles.detailText}>{order.deliverTime}</Text>
            </View>

            {order.specialInstructions && (
              <View style={styles.specialInstructions}>
                <Text style={styles.detailLabel}>
                  <MaterialIcons name="info" size={18} color="#6B7280" /> Special Instructions:
                </Text>
                <Text style={styles.italicText}>{order.specialInstructions}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items:</Text>
            <View style={styles.itemsContainer}>
              {order.items?.map((item, idx) => (
                <View key={idx} style={styles.itemCard}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                    {item.foodType && <Text style={styles.itemMeta}>Food Type: {item.foodType}</Text>}
                  </View>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary:</Text>
            <View style={styles.paymentSummary}>
              <View style={styles.paymentRow}>
                <Text>Subtotal:</Text>
                <Text>${order.subtotal?.toFixed(2)}</Text>
              </View>

              {order.deliveryFee > 0 && (
                <View style={styles.paymentRow}>
                  <Text>Delivery Fee:</Text>
                  <Text>+ ${order.deliveryFee?.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.paymentRow}>
                <Text>Platform Fee:</Text>
                <Text>+ ${order.platformFee?.toFixed(2)}</Text>
              </View>
              {order.gstCharges > 0 && (
                <View style={styles.paymentRow}>
                  <Text>GST Charges:</Text>
                  <Text>+ ${order.gstCharges?.toFixed(2)}</Text>
                </View>
              )}

              {Array.isArray(order?.totalOtherCharges) && order.totalOtherCharges.length > 0 && (
                <View>
                  {order.totalOtherCharges.map((charge, idx) => (
                    <View key={idx} style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>{charge.name || 'Additional Charge'}:</Text>
                      <Text style={styles.paymentValue}>${charge.amount}</Text>
                    </View>
                  ))}
                </View>
              )}
              {order.discount > 0 && (
                <View style={[styles.paymentRow, styles.discountRow]}>
                  <Text>Discount:</Text>
                  <Text>- ${order.discount?.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Paid:</Text>
                <Text style={styles.totalAmount}>${order.amount?.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cancelOrderButton}
            onPress={() => setIsCancelModalVisible(true)}
          >
            <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
          </TouchableOpacity>

          {order.subStatus && order.subStatus.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Timeline:</Text>
              <View style={styles.timeline}>
                {order.subStatus
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((statusEntry, idx) => (
                    <View key={idx} style={styles.timelineItem}>
                      <View style={styles.timelineDot}>
                        {statusEntry.status === "delivered" ? (
                          <AntDesign name="check" size={12} color="#10B981" />
                        ) : (
                          <Feather name="clock" size={12} color="#F59E0B" />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineHeader}>
                          <Text style={styles.timelineTitle}>{statusEntry.status}</Text>
                          {idx === order.subStatus.length - 1 && (
                            <View style={styles.latestBadge}>
                              <Text style={styles.latestBadgeText}>Latest</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.timelineDate}>
                          On {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    );
  };

  const isActiveOrder = !['delivered', 'cancelled', 'rejected', 'user_cancel'].includes(order.status?.toLowerCase());

  return (
    <View style={styles.orderCard}>
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <Image
            source={order.image}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
              {order.restaurantname || 'Restaurant'}
            </Text>
            <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
              {order.location || 'Location not specified'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onToggleFavorite}>
          <Ionicons
            name={order.fav ? "heart" : "heart-outline"}
            size={24}
            color={order.fav ? "#e23744" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.orderItems}>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            {item.veg ? (
              <View style={styles.vegIcon}>
                <View style={styles.vegIconInner} />
              </View>
            ) : (
              <View style={[styles.vegIcon, styles.nonVegIcon]}>
                <View style={[styles.vegIconInner, styles.nonVegIconInner]} />
              </View>
            )}
            <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
              {item.quantity || 1} × {item.name || 'Item'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.orderDate}>
            {formatDate(order.orderTime)} at {formatTime(order.orderTime)}
          </Text>
          <Text
            style={[
              styles.orderStatus,
              { color: getStatusColor(order.status) },
            ]}
          >
            {order.status || 'Status unknown'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.amountContainer}
          onPress={() => setIsPriceModalVisible(true)}
        >
          <Text style={styles.amount}>${(order.amount || 0).toFixed(2)}</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

      </View>



      <Modal
        visible={isPriceModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPriceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.priceDetailsContainer}>
              <TouchableOpacity onPress={() => setIsPriceModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>


              {renderPriceDetails()}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCancelModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Order #{order._id.slice(-6)}</Text>
              <TouchableOpacity onPress={() => setIsCancelModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Please provide a reason for cancelling this order:</Text>
              <TextInput
                style={styles.cancelReasonInput}
                multiline
                numberOfLines={4}
                placeholder="e.g., Change of plans, moving, received wrong order, etc."
                value={cancelReason}
                onChangeText={setCancelReason}
              />
              {message ? <Text style={styles.messageText}>{message}</Text> : null}
              <View style={styles.cancelButtonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelOrderSubmit}
                  disabled={!cancelReason.trim() || cancellingOrderId === order._id}
                >
                  <Text style={styles.cancelButtonText}>
                    {cancellingOrderId === order._id ? 'Cancelling...' : 'Submit Cancellation'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vegIcon: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#0f8a65',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegIconInner: {
    width: 8,
    height: 8,
    backgroundColor: '#0f8a65',
    borderRadius: 4,
  },
  nonVegIcon: {
    borderColor: '#e23744',
  },
  nonVegIconInner: {
    backgroundColor: '#e23744',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelOrderButton: {
    backgroundColor: '#e23744',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  cancelOrderButtonText: {
    color: 'white',
    fontWeight: '500',
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
    maxHeight: '90%',
    padding: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    padding: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  cancelReasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  messageText: {
    color: '#e23744',
    marginVertical: 8,
    textAlign: 'center',
  },
  cancelButtonContainer: {
    marginTop: 16,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e23744',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  priceDetailsContainer: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
    headersub: {
    flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: 15,
    // paddingBottom: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 8,
  },
  orderId: {
    color: '#e40b0bff',
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 20,
    color: '#374151',
  },
  bold: {
    fontWeight: 'bold',
  },
  specialInstructions: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  italicText: {
    fontStyle: 'italic',
    marginLeft: 20,
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 10,
  },
  itemsContainer: {
    marginTop: 10,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: '500',
    color: '#111827',
  },
  itemMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemPrice: {
    fontWeight: '600',
    color: '#0D9488',
  },
  paymentSummary: {
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  discountRow: {
    color: '#DC2626',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0D9488',
  },
  timeline: {
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 20,
  },
  timelineItem: {
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -30,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  timelineContent: {
    marginLeft: 10,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  latestBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  latestBadgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});

export default TakeawayOrderCard;