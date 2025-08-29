import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import  {styles } from '../styles/TiffinOrderCardstyle';
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
   const firmId = firstItem.sourceEntityId?._id;
   console.log(firmId)
  const tiffinImage = firstItem.img || "https://placehold.co/150x150/e0f2f7/00796b?text=Tiffin";
    const { user, profileData, api } = useAuth();
  const currentUserData = profileData?.email ? profileData : (user ? { username: user } : null);
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
              <Text style={styles.priceText}>${item.totalPrice?.toFixed(2)}</Text>
              <Entypo name="chevron-right" size={22} color="#aaa" />
            </TouchableOpacity>
          </View>
              {/* <TouchableOpacity
                    style={styles.viewDetailsButton}
                      onPress={() => router.push({
                              pathname: "/screens/Userrating",
                              params: {
                                firmId: firmId,
                                restaurantName:tiffinName,
                                currentUser: currentUserData,
                                reviewType:'tiffin',
                              }
                            })}
                  >
                    <Text style={styles.viewDetail}>Review</Text>
                  </TouchableOpacity> */}
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
                     <TouchableOpacity onPress={closeOrderDetails} style={styles.closeButton}>
                    <Ionicons name="close" size={26} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Order Details</Text>
               
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
                         <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>DeliverTime:</Text>
                        <Text style={[styles.detailValue, styles.descriptionText]}>{selectedOrder.deliverTime}</Text>
                        </View>
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

export default TiffinOrderCard;