import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TiffinOrderCard = ({ 
  item, 
  formatDate, 
  formatTime, 
  getStatusColor,
  onToggleFavorite,
  selectedOrder,
  showOrderModal,
  closeOrderDetails,
  openCancelModal,
  calculateProgress,
  onPress,
}) => {
  const firstItem = item.items && item.items.length > 0 ? item.items[0] : {};
  const tiffinName = firstItem.sourceEntityId?.kitchenName || firstItem.name || "Unknown Tiffin Service";
  const tiffinImage = firstItem.img || "https://placehold.co/150x150/e0f2f7/00796b?text=Tiffin";

  const handleFavoritePress = () => {
    if (onToggleFavorite) {
      onToggleFavorite(item._id);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.orderCard}
         onPress={() => onPress(item)} 
        activeOpacity={0.8}
      >
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Image
              source={{ uri: tiffinImage }}
              style={styles.restaurantImage}
              onError={() => console.log("Image load error")}
              resizeMode="cover"
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName} numberOfLines={2} ellipsizeMode="tail">
                {tiffinName}
              </Text>
              <Text style={styles.priceText}>${item.totalPrice?.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Ionicons
              name={item.fav ? "heart" : "heart-outline"}
              size={24}
              color={item.fav ? "#e23744" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.orderItems}>
            {item.items?.map((orderItem, idx) => {
              const mealType = orderItem.mealType?.name || "Tiffin Meal";
              const quantity = orderItem.quantity || 1;
              const isVegetarian = orderItem.foodType?.toLowerCase().includes('veg');

              return (
                <View key={`${idx}`} style={styles.orderItemt}>
                  {isVegetarian ? (
                    <View style={styles.vegIcon}>
                      <View style={styles.vegIconInner} />
                    </View>
                  ) : (
                    <View style={[styles.vegIcon, styles.nonVegIcon]}>
                      <View style={[styles.vegIconInner, styles.nonVegIconInner]} />
                    </View>
                  )}

                  <Text
                    style={styles.itemText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {quantity} × {mealType}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.orderDate}>
                {formatDate(item?.orderTime)} at {formatTime(item?.orderTime)}
              </Text>
              <View>
                <Text
                  style={[
                    styles.orderStatus,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status || 'Status unknown'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewDetailsButton}
             onPress={() => onPress(item)} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

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
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, styles.discountText]}>OrderId:-</Text>
                  <Text style={[styles.paymentValue, styles.discountText]}>{selectedOrder?._id}</Text>
                </View>
                
                {/* Order Summary Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="restaurant-outline" size={22} color="#0b50c6ff" />
                    <Text style={styles.infoText}>
                      {selectedOrder.items?.[0]?.sourceEntityId?.kitchenName || "Unknown Tiffin Service"}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={22} color="#0b50c6ff" />
                    <Text style={styles.infoText}>
                      {formatDate(selectedOrder.orderTime)} at {formatTime(selectedOrder.orderTime)}
                    </Text>
                  </View>
                  {selectedOrder.phone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call" size={22} color="#2f8c07ff" />
                      <Text style={styles.infoText}>{selectedOrder.phone.number || 'N/A'}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={22} color="#0b50c6ff" />
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
                      <View style={styles.itemHeader}>
                        {item.foodType && (
                          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
                            {item.foodType}
                          </Text>
                        )}
                      </View>

                      <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Qty:</Text>
                          <Text style={styles.detailValue}>{item.quantity}</Text>
                        </View>

                        {item.mealType?.name && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Meal:</Text>
                            <Text style={styles.detailValue}>{item.mealType.name}</Text>
                          </View>
                        )}

                        {item.selectedPlan?.name && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Plan:</Text>
                            <Text style={styles.detailValue}>{item.selectedPlan.name}</Text>
                          </View>
                        )}

                        {item.description && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Description:</Text>
                            <Text style={[styles.detailValue, styles.descriptionText]} numberOfLines={2} ellipsizeMode="tail">
                              {item.description}
                            </Text>
                          </View>
                        )}
                      </View>

                      {selectedOrder.deliverTime && (
                        <Text style={styles.itemDetail}>DeliverTime: {selectedOrder.deliverTime}</Text>
                      )}
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
                <View style={styles.section}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 3,
    paddingTop: 13,
    paddingLeft: 13,
    paddingRight: 13,
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
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantDetails: {
    padding: 10,
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  orderDate: {
    marginBottom: 10,
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    padding: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  viewDetailsButton: {
    backgroundColor: '#08a742',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemt: {
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f4f3f3ff',
    padding: 20,
    width: '100%',
    maxHeight: '95%',
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  section: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#575656ff',
  },
  specialInstructionsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 10,
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
  progressSection: {
    backgroundColor: '#E0F7FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
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
  orderItem: {
    backgroundColor: '#ffffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  descriptionText: {
    fontStyle: 'bold',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
    marginLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#BDBDBD',
    paddingLeft: 19,
  },
  timelineItem: {
    marginBottom: 16,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -30,
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  latestBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timelineDate: {
    fontSize: 14,
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
});

export default TiffinOrderCard;