import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

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
        className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-border"
         onPress={() => onPress(item)} 
        activeOpacity={0.8}
      >
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: tiffinImage }}
              className="w-16 h-16 rounded-lg mr-3"
              onError={() => console.log("Image load error")}
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-textprimary font-outfit-bold text-lg" numberOfLines={2} ellipsizeMode="tail">
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

        <View>
          <View className="mb-3">
            {item.items?.map((orderItem, idx) => {
              const mealType = orderItem.mealType?.name || "Tiffin Meal";
              const quantity = orderItem.quantity || 1;
              const isVegetarian = orderItem.foodType?.toLowerCase().includes('veg');

              return (
                <View key={`${idx}`} className="flex-row items-center mb-2">
                  {isVegetarian ? (
                    <View className="w-4 h-4 border-2 border-green-500 rounded mr-2 items-center justify-center">
                      <View className="w-2 h-2 bg-green-500 rounded" />
                    </View>
                  ) : (
                    <View className="w-4 h-4 border-2 border-red-500 rounded mr-2 items-center justify-center">
                      <View className="w-2 h-2 bg-red-500 rounded" />
                    </View>
                  )}

                  <Text
                    className="text-textprimary font-outfit text-sm flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {quantity} × {mealType}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-textsecondary font-outfit text-sm">
                {formatDate(item?.orderTime)} at {formatTime(item?.orderTime)}
              </Text>
              <View>
                <Text
                  className="font-outfit-bold text-sm"
                  style={{ color: getStatusColor(item.status) }}
                >
                  {item.status || 'Status unknown'}
                </Text>
              </View>
            </View>
        <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onPress(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-primary font-outfit-bold text-lg mr-2">${item.totalPrice?.toFixed(2)}</Text>
              <Entypo name="chevron-right" size={22} color="#aaa" />
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
          <View className="flex-1 bg-black/50 justify-center">
            <View className="bg-white rounded-t-3xl max-h-4/5 m-4">
              <ScrollView className="p-4">
                {/* Modal Header */}
                <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-border">
                     <TouchableOpacity onPress={closeOrderDetails} className="p-2">
                    <Ionicons name="close" size={26} color="#666" />
                  </TouchableOpacity>
                  <Text className="text-textprimary font-outfit-bold text-xl">Order Details</Text>
               
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-sm text-green-600">OrderId:-</Text>
                  <Text className="text-sm text-green-600">{selectedOrder?._id}</Text>
                </View>
                
                {/* Order Summary Section */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-textprimary mb-3">Order Summary</Text>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="restaurant-outline" size={22} color="#0b50c6ff" />
                    <Text className="ml-2 text-sm text-textsecondary">
                      {selectedOrder.items?.[0]?.sourceEntityId?.kitchenName || "Unknown Tiffin Service"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={22} color="#0b50c6ff" />
                    <Text className="ml-2 text-sm text-textsecondary">
                      {formatDate(selectedOrder.orderTime)} at {formatTime(selectedOrder.orderTime)}
                    </Text>
                  </View>
                  {selectedOrder.phone && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="call" size={22} color="#2f8c07ff" />
                      <Text className="ml-2 text-sm text-textsecondary">{selectedOrder.phone.number || 'N/A'}</Text>
                    </View>
                  )}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={22} color="#0b50c6ff" />
                    <Text className="ml-2 text-sm text-textsecondary">{selectedOrder.address || "N/A"}</Text>
                  </View>
                  {selectedOrder.specialInstructions && (
                    <View className="bg-gray-50 p-3 rounded-lg mt-2">
                      <View className="flex-row items-center mb-1">
                        <MaterialCommunityIcons name="information-outline" size={20} color="gray" />
                        <Text className="ml-2 font-medium text-textprimary">Special Instructions:</Text>
                      </View>
                      <Text className="text-sm text-textsecondary">{selectedOrder.specialInstructions}</Text>
                    </View>
                  )}
                </View>

                {/* Order Items Section */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-textprimary mb-3">Order Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} className="bg-gray-50 p-3 rounded-lg mb-3">
                      <View className="mb-2">
                        {item.foodType && (
                          <Text className="font-medium text-textprimary" numberOfLines={1} ellipsizeMode="tail">
                            {item.foodType}
                          </Text>
                        )}
                      </View>

                      <View>
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-sm text-textsecondary">Qty:</Text>
                          <Text className="text-sm text-textprimary">{item.quantity}</Text>
                        </View>

                        {item.mealType?.name && (
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-textsecondary">Meal:</Text>
                            <Text className="text-sm text-textprimary">{item.mealType.name}</Text>
                          </View>
                        )}

                        {item.selectedPlan?.name && (
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-textsecondary">Plan:</Text>
                            <Text className="text-sm text-textprimary">{item.selectedPlan.name}</Text>
                          </View>
                        )}

                        {item.description && (
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-textsecondary">Description:</Text>
                            <Text className="text-sm text-textprimary flex-1 ml-2" numberOfLines={2} ellipsizeMode="tail">
                              {item.description}
                            </Text>
                          </View>
                        )}
                      </View>

                      {selectedOrder.deliverTime && (
                         <View className="flex-row justify-between mb-1">
                          <Text className="text-sm text-textsecondary">DeliverTime:</Text>
                        <Text className="text-sm text-textprimary">{selectedOrder.deliverTime}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {selectedOrder.items?.[0]?.startDate && (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-textprimary mb-3">Subscription Progress</Text>
                    <View className="bg-gray-200 h-2 rounded-full mb-2">
                      <View className="bg-primary h-2 rounded-full" style={{ width: `${calculateProgress(selectedOrder).progress}%` }} />
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-textsecondary">
                        {calculateProgress(selectedOrder).deliveredDays} days delivered
                      </Text>
                      <Text className="text-sm text-textsecondary">
                        {calculateProgress(selectedOrder).progress.toFixed(0)}% complete
                      </Text>
                    </View>
                  </View>
                )}

                {/* Payment Summary Section */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-textprimary mb-3">Payment Summary:</Text>

                  <View>
                    <View className="flex-row justify-between py-1">
                      <Text className="text-sm text-textsecondary">Subtotal:</Text>
                      <Text className="text-sm text-textprimary">${selectedOrder.subtotal?.toFixed(2)}</Text>
                    </View>

                    {selectedOrder.deliveryFee > 0 && (
                      <View className="flex-row justify-between py-1">
                        <Text className="text-sm text-textsecondary">Delivery Fee:</Text>
                        <Text className="text-sm text-textprimary">${selectedOrder.deliveryFee?.toFixed(2)}</Text>
                      </View>
                    )}

                    {selectedOrder.gstCharges > 0 && (
                      <View className="flex-row justify-between py-1">
                        <Text className="text-sm text-textsecondary">GST Charges:</Text>
                        <Text className="text-sm text-textprimary">${selectedOrder.gstCharges?.toFixed(2)}</Text>
                      </View>
                    )}

                    {selectedOrder.platformFee > 0 && (
                      <View className="flex-row justify-between py-1">
                        <Text className="text-sm text-textsecondary">Platform Fee:</Text>
                        <Text className="text-sm text-textprimary">${selectedOrder.platformFee?.toFixed(2)}</Text>
                      </View>
                    )}

                    {Array.isArray(selectedOrder?.totalOtherCharges) && selectedOrder.totalOtherCharges.length > 0 && (
                      <View>
                        {selectedOrder.totalOtherCharges.map((charge, idx) => (
                          <View key={idx} className="flex-row justify-between py-1">
                            <Text className="text-sm text-textsecondary">{charge.name || 'Additional Charge'}:</Text>
                            <Text className="text-sm text-textprimary">${charge.amount?.toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View className="flex-row justify-between py-1">
                      <Text className="text-sm text-green-600">Discount:</Text>
                      <Text className="text-sm text-green-600">- ${selectedOrder.discount?.toFixed(2)}</Text>
                    </View>

                    <View className="flex-row justify-between py-2 border-t border-gray-200 mt-2">
                      <Text className="text-base font-bold text-textprimary">Total Paid:</Text>
                      <Text className="text-base font-bold text-textprimary">${selectedOrder.totalPrice?.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                {selectedOrder.subStatus?.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-textprimary mb-3">Order Timeline</Text>
                    <View>
                      {selectedOrder.subStatus
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((status, index) => (
                          <View key={index} className="flex-row items-center mb-3">
                            <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center mr-3">
                              {status.statue === "delivered" ? (
                                <Ionicons name="checkmark" size={12} color="#08a742" />
                              ) : (
                                <Ionicons name="time" size={12} color="#FFA500" />
                              )}
                            </View>
                            <View className="flex-1">
                              <Text className="text-sm font-medium text-textprimary">
                                {status.statue}
                                {index === selectedOrder.subStatus.length - 1 && (
                                  <Text className="text-xs text-primary"> Latest</Text>
                                )}
                              </Text>
                              <Text className="text-xs text-textsecondary">
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
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-textprimary mb-3">Cancellation Details</Text>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="alert-circle-outline" size={20} color="#666" />
                      <Text className="ml-2 text-sm text-textsecondary">Reason: {selectedOrder.cancellationReason}</Text>
                    </View>
                    {selectedOrder.cancelledAt && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text className="ml-2 text-sm text-textsecondary">
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
                    <View className="mt-4">
                      <TouchableOpacity
                        className="bg-red-500 p-4 rounded-lg items-center"
                        onPress={openCancelModal}
                      >
                        <Text className="text-white font-bold">Cancel Order</Text>
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