import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCart } from '@/context/CartContext';

const MealCustomizeScreen = () => {
  /* Original CSS Reference:
   * modalContainer: { flex: 1, backgroundColor: '#fff' }
   * modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
   * modalTitle: { fontSize: 20, fontFamily: "outfit-bold", fontWeight: '700', color: '#333', flex: 1, textAlign: 'center' }
   * closeButton: { padding: 8, borderRadius: 20, backgroundColor: '#f5f5f5' }
   * ItemImage: { width: '100%', height: 200, resizeMode: 'cover' }
   * modalScroll: { flex: 1 }
   * scrollContent: { paddingBottom: 120, paddingHorizontal: 20 }
   * planDurationText: { fontSize: 14, fontFamily: "outfit-medium", color: '#666', fontWeight: '500' }
   * customizationForm: {}
   * formGroup: { marginBottom: 10 }
   * formLabel: { fontSize: 16, fontFamily: "outfit-medium", fontWeight: '600', color: '#444', marginBottom: 12 }
   * dropdownContainer: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden' }
   * discountBadge: { fontSize: 14, fontFamily: "outfit-bold", color: '#4CAF50', marginTop: 8, textAlign: 'right', fontWeight: '500' }
   * calendarContainer: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, overflow: 'hidden', marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
   * selectedRangeText: { fontSize: 14, fontFamily: "outfit-bold", color: '#4CAF50', textAlign: 'center', marginBottom: 12, fontWeight: '500' }
   * calendarModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }
   * calendarModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%', elevation: 5 }
   * calendarButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }
   * calendarButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, minWidth: 120, alignItems: 'center' }
   * cancelButton: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' }
   * applyButton: { backgroundColor: '#4CAF50' }
   * calendarButtonText: { fontWeight: '600', fontSize: 16, fontFamily: "outfit-medium" }
   * datePreviewContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, backgroundColor: '#fff' }
   * datePreviewText: { fontSize: 16, fontFamily: "outfit-medium", color: '#333' }
   * quantityContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, alignSelf: 'flex-start', backgroundColor: '#fff' }
   * quantityButton: { padding: 14, backgroundColor: '#f9f9f9' }
   * quantityText: { fontSize: 16, fontFamily: "outfit-medium", fontWeight: '600', color: '#333', paddingHorizontal: 20, minWidth: 30, textAlign: 'center' }
   * priceBreakdown: { marginVertical: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 10 }
   * priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }
   * priceLabel: { fontSize: 15, fontFamily: "outfit-medium", color: '#666' }
   * priceValue: { fontSize: 15, fontWeight: '600', color: '#333' }
   * discountText: { marginTop: 5, fontSize: 15, fontFamily: "outfit-medium", color: '#4CAF50', textAlign: 'center' }
   * totalPrice: { fontWeight: 'bold', color: '#4CAF50', fontSize: 18, fontFamily: "outfit-bold", marginTop: 8 }
   * selectedAddonsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }
   * selectedAddonBadge: { backgroundColor: '#E8F5E9', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }
   * selectedAddonText: { fontSize: 13, fontFamily: "outfit", color: '#2E7D32', fontWeight: '500' }
   * timeSlotsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }
   * timeSlotButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' }
   * timeSlotSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
   * timeSlotText: { color: '#333', fontSize: 14, fontFamily: "outfit-bold", fontWeight: '500' }
   * timeSlotTextSelected: { color: '#fff' }
   * addonsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }
   * addonOption: { width: '48%', padding: 14, marginBottom: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
   * addonSelected: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50', borderWidth: 1.5 }
   * addonLabel: { fontSize: 14, fontFamily: "outfit-bold", color: '#333', fontWeight: '500' }
   * actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 8 }
   * submitButton: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', flex: 1, marginLeft: 10, justifyContent: 'center' }
   * submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16, fontFamily: "outfit-medium" }
   * submitButtonDisabled: { backgroundColor: '#cccccc' }
   * mealContainer: { flexDirection: 'row', marginTop: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }
   * menuItemImage: { width: 100, height: 100, borderRadius: 8, borderColor: '#151515ff', borderWidth: 1, marginRight: 20 }
   * mealInfo: { flex: 1, flexDirection: 'column' }
   * mealName: { fontSize: 18, fontFamily: "outfit-bold", fontWeight: 'bold', marginBottom: 4, color: '#333' }
   * mealPrice: { fontSize: 16, fontFamily: "outfit-medium", fontWeight: '600', marginBottom: 8, color: '#2ecc71' }
   * mealDescription: { fontSize: 14, fontFamily: "outfit-bold", color: '#666', lineHeight: 20 }
   */
  const router = useRouter();
  const { addToCart } = useCart();
  const params = useLocalSearchParams();
  const firmId = params.firmId || params.firm || params.id;
  const img = params.img;
  const restaurantName = params.restaurantName;
  const mealItem = params.mealItem ? JSON.parse(params.mealItem) : null;
  
  console.log('Restaurant ID:', firmId);
  console.log('Restaurant ID:', img);
  console.log('Restaurant Name:', restaurantName);
  const planTypes = params.planTypes ? JSON.parse(params.planTypes) : [];
  const preferences = params.preferences ? JSON.parse(params.preferences) : {};

  if (!Array.isArray(planTypes)) {
    console.error('Invalid planTypes received:', planTypes);
    Alert.alert('Error', 'Invalid meal plans data');
    router.back();
  }

  const [state, setState] = useState({
    selectedPlan: null,
    selectedTimeSlots: [],
    selectedAddons: [],
    dateRange: { startDate: null, endDate: null },
    flexibleDates: [],
    quantity: 1,
    isLoading: false,
  });

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [tempSelectedDates, setTempSelectedDates] = useState({
    startDate: null,
    endDate: null,
    flexibleDates: []
  });

  const Plan_TYPES = planTypes.map(plan => {
    const planPrice = mealItem?.prices?.[plan._id] ||
      mealItem?.availablePlans?.find(p => p.id === plan.id)?.price ||
      mealItem?.basePrice || 0;

    return {
      label: `${plan.label} ${plan.label === '1' ? '' : ''}`,
      value: plan._id || plan.id,
      price: planPrice,
      priceMultiplier: plan.priceMultiplier || 1,
      discount: plan.discount || 0,
      discountText: plan.discountText || 'No discount',
      days: parseInt(plan.label) || 1,
      _id: plan._id
    };
  });

  const timeSlots = params.timeSlots ? JSON.parse(params.timeSlots) : [];
  const TIME_SLOTS = timeSlots.map((slot, index) => {
    if (typeof slot === 'string') {
      return {
        label: slot,
        value: slot,
        key: `slot-${index}`
      };
    }
    return {
      label: slot.time || slot.label || `Time Slot ${index + 1}`,
      value: slot.id || slot.value || `slot-${index}`,
      key: slot.id || `slot-${index}`
    };
  });

  const getAddons = () => {
    if (!mealItem) return [];
    if (mealItem.availableAddons) {
      return mealItem.availableAddons.map(addon => ({
        label: `${addon.name} (+$${addon.price.toFixed(2)})`,
        value: addon.id,
        price: addon.price,
        key: addon.id
      }));
    }
    return [
      { label: 'Extra Roti (+$10.00)', value: 'extra_roti', price: 10.00, key: 'extra_roti' },
      { label: 'Extra Rice (+$20.00)', value: 'extra_rice', price: 20.00, key: 'extra_rice' },
      { label: 'Extra Sabzi (+$30.00)', value: 'extra_sabzi', price: 30.00, key: 'extra_sabzi' },
    ];
  };

  const ADDONS = getAddons();

  const resetState = useCallback(() => {
    setState({
      selectedPlan: null,
      selectedTimeSlots: [],
      selectedAddons: [],
      dateRange: { startDate: null, endDate: null },
      flexibleDates: [],
      quantity: 1,
      isLoading: false
    });
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    router.back();
  }, [router, resetState]);

  const handlePlanChange = (value) => {
    const selectedPlan = Plan_TYPES.find(plan => plan.value === value);
    if (!selectedPlan) {
      console.error('Selected plan not found:', value);
      return;
    }

    setState(prev => ({
      ...prev,
      selectedPlan,
      dateRange: { startDate: null, endDate: null },
      flexibleDates: [],
      selectedTimeSlots: [],
      selectedAddons: []
    }));
  };

const calculateEndDate = useCallback(() => {
  if (!state.selectedPlan) return null;
  
  // For single day plans, return the same date (time difference handled in submit)
  if (state.selectedPlan.days <= 1) {
    return state.dateRange.startDate;
  }

  if (state.dateRange.startDate && state.dateRange.endDate) {
    return state.dateRange.endDate;
  }

  if (state.flexibleDates && state.flexibleDates.length > 0) {
    const sortedDates = [...state.flexibleDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return sortedDates[sortedDates.length - 1];
  }

  if (!state.dateRange.startDate) return null;

  const endDateCalc = new Date(state.dateRange.startDate);
  endDateCalc.setDate(endDateCalc.getDate() + (state.selectedPlan.days - 1));
  return endDateCalc.toISOString().split('T')[0];
}, [state.selectedPlan, state.dateRange, state.flexibleDates]);

const handleTempDayPress = (day) => {
  if (!day || !state.selectedPlan) return;

  const selectedDate = day.dateString;
  const daysInPlan = state.selectedPlan.days || 1;

  if (daysInPlan === 1) {
    // For one-day plans, just set the start date
    setTempSelectedDates({
      startDate: selectedDate,
      endDate: selectedDate,
      flexibleDates: [selectedDate]
    });
  } else {
    const start = new Date(selectedDate);
    const end = new Date(start);
    end.setDate(start.getDate() + daysInPlan - 1);

    setTempSelectedDates({
      startDate: selectedDate,
      endDate: end.toISOString().split('T')[0],
      flexibleDates: generateDateRange(selectedDate, end.toISOString().split('T')[0])
    });
  }
};

  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const getMarkedDates = (dates = state.dateRange) => {
    if (!state.selectedPlan) return {};

    const marked = {};

    if (dates.startDate) {
      marked[dates.startDate] = {
        startingDay: true,
        color: '#4CAF50',
        textColor: 'white',
      };
    }

    if (dates.endDate) {
      marked[dates.endDate] = {
        endingDay: true,
        color: '#4CAF50',
        textColor: 'white',
      };
    }

    if (dates.startDate && dates.endDate) {
      const range = generateDateRange(dates.startDate, dates.endDate);
      range.forEach(date => {
        if (date !== dates.startDate && date !== dates.endDate) {
          marked[date] = {
            color: '#E8F5E9',
            textColor: '#2E7D32',
          };
        }
      });
    }

    return marked;
  };

  const handleApplyDates = () => {
    setState(prev => ({
      ...prev,
      dateRange: {
        startDate: tempSelectedDates.startDate,
        endDate: tempSelectedDates.endDate
      },
      flexibleDates: tempSelectedDates.flexibleDates
    }));
    setShowCalendarModal(false);
  };

  const handleCancelDates = () => {
    setTempSelectedDates({
      startDate: state.dateRange.startDate,
      endDate: state.dateRange.endDate,
      flexibleDates: state.flexibleDates
    });
    setShowCalendarModal(false);
  };

  const calculateTotal = () => {
    const defaultReturn = {
      subtotal: 0,
      discount: 0,
      total: 0
    };

    if (!mealItem || !state.selectedPlan) return defaultReturn;

    try {
      const planPrice = state.selectedPlan.price || mealItem.basePrice || 0;
      const daysInPlan = state.selectedPlan.days || 1;
      const quantity = state.quantity || 1;

      let subtotal = planPrice * quantity;

      const addonsTotal = state.selectedAddons.reduce((sum, addon) =>
        sum + ((addon?.price || 0) * daysInPlan * quantity), 0);
      subtotal += addonsTotal;

      const total = subtotal;

      return {
        subtotal: subtotal || 0,
        total: total || 0
      };
    } catch (error) {
      console.error("Error calculating total:", error);
      return defaultReturn;
    }
  };

  const handleTimeSlotChange = (value) => {
    setState(prev => ({
      ...prev,
      selectedTimeSlots: value ? [value] : []
    }));
  };

const handleSubmit = async () => {
  try {
    setState(prev => ({ ...prev, isLoading: true }));

    if (!mealItem) throw new Error('No meal item selected');
    if (!state.selectedPlan) throw new Error('Please select a plan');
    if (!state.selectedTimeSlots.length) throw new Error('Please select at least one time slot');
    if (!state.dateRange.startDate) throw new Error('Please select dates');

    const { total } = calculateTotal();
    const startDate = new Date(state.dateRange.startDate);
    
    // Handle end date calculation differently for one-day plans
    let endDate;
    if (state.selectedPlan.days <= 1) {
      // For one-day plans, set end date to 5 hours after start date
      endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
    } else {
      const calculatedEndDate = calculateEndDate();
      endDate = calculatedEndDate ? new Date(calculatedEndDate) : null;
    }

    const cartItem = {
      itemToAdd: {
        productId: mealItem.id,
        name: mealItem.name,
        description: mealItem.description || "",
        quantity: state.quantity,
        img: img || require('@/assets/images/food_placeholder.jpg'),
        price: total,
        foodType: mealItem.foodType || 'Vegetarian',
        itemType: "tiffin",
        productModelType: "Tiffin",
        sourceEntityId: firmId,
        sourceEntityName: "Tiffin",
        mealType: {
          id: mealItem.id,
          name: mealItem.name
        },
        selectedPlan: {
          id: state.selectedPlan.value,
          name: state.selectedPlan.label,
        },
        dates: state.flexibleDates,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        deliverySlot: state.selectedTimeSlots[0],
      }
    };
    
    addToCart(cartItem);
    router.back();
  } catch (error) {
    console.error("Order submission failed:", error);
    Alert.alert('Error', error.message || 'Failed to submit order');
  } finally {
    setState(prev => ({ ...prev, isLoading: false }));
  }
};

  const getInstructionText = () => {
    if (!state.selectedPlan) return 'Select a plan first';
    return `Select your start date`;
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4 border-b border-border bg-white">
        <Text className="text-textprimary font-outfit-bold text-xl">Customize Your Meal</Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      {/* <Image
  source={typeof img === 'string' ? { uri: img } : img || require('@/assets/images/food_placeholder.jpg')}
  style={styles.menuItemImage}
  resizeMode="cover"
  defaultSource={require('@/assets/images/food_placeholder.jpg')} 
/> */}
       {mealItem && (
          <View className="flex-row bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Image
              source={typeof img === 'string' ? { uri: img } : img || require('@/assets/images/food_placeholder.jpg')}
              className="w-20 h-20 rounded-lg mr-4"
              resizeMode="cover"
              defaultSource={require('@/assets/images/food_placeholder.jpg')}
            />
            <View className="flex-1">
              <Text className="text-textprimary font-outfit-bold text-lg mb-1">{mealItem.name}</Text>
              <Text className="text-primary font-outfit-bold text-base mb-1">
                {state.selectedPlan ? (
                  <>
                    Price: ${state.selectedPlan.price.toFixed(2)}
                    {state.selectedPlan.days > 1 && (
                      <Text className="text-textsecondary font-outfit text-sm">
                        {' '}({state.selectedPlan.days} days)
                      </Text>
                    )}
                  </>
                ) : (
                  `Base Price: $${(mealItem?.basePrice || 0).toFixed(2)}`
                )}
              </Text>
              <Text className="text-textsecondary font-outfit text-sm">{mealItem.description}</Text>
            </View>
          </View>
        )}

        <View className="bg-white rounded-lg p-4">
          <View className="mb-4">
            <Text className="text-textprimary font-outfit-bold text-base mb-2">Plan Type</Text>
            <View className="border border-border rounded-lg">
              <RNPickerSelect
                onValueChange={handlePlanChange}
                items={Plan_TYPES}
                placeholder={{ label: 'Select a plan type', value: null }}
                value={state.selectedPlan?.value}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          {state.selectedPlan && (
            <View className="mb-4">
              <Text className="text-textprimary font-outfit-bold text-base mb-2">{getInstructionText()}</Text>
              <TouchableOpacity
                className="flex-row justify-between items-center p-3 border border-border rounded-lg bg-background"
                onPress={() => {
                  setTempSelectedDates({
                    startDate: state.dateRange.startDate,
                    endDate: state.dateRange.endDate,
                    flexibleDates: state.flexibleDates
                  });
                  setShowCalendarModal(true);
                }}
              >
                <Text className="text-textprimary font-outfit">
                  {state.dateRange.startDate
                    ? `${state.dateRange.startDate} ${calculateEndDate() ? `to ${calculateEndDate()}` : ''}`
                    : 'Select dates'}
                </Text>
                <Ionicons name="calendar" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          )}

          <Modal
            visible={showCalendarModal}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCancelDates}
          >
            <View className="flex-1 bg-black/50 justify-center p-4">
              <View className="bg-white rounded-lg p-4">
                <Calendar
                  className="mb-4"
                  markedDates={getMarkedDates(tempSelectedDates)}
                  onDayPress={handleTempDayPress}
                  markingType="period"
                  minDate={new Date()}
                  theme={{
                    selectedDayBackgroundColor: '#af4c4cff',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#af4c4cff',
                    dotColor: '#af4c4cff',
                    arrowColor: '#af4c4cff',
                    monthTextColor: '#333',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 12,
                    textMonthFontSize: 15,
                    textDayHeaderFontSize: 14,
                    backgroundColor: '#ffffff'
                  }}
                />
                <View className="flex-row justify-end space-x-3">
                  <TouchableOpacity
                    className="px-4 py-2 border border-border rounded-lg mr-3"
                    onPress={handleCancelDates}
                  >
                    <Text className="text-textsecondary font-outfit">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-primary rounded-lg"
                    onPress={handleApplyDates}
                    disabled={!tempSelectedDates.startDate}
                  >
                    <Text className="text-white font-outfit-bold">Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View className="mb-4">
            <Text className="text-textprimary font-outfit-bold text-base mb-2">Delivery Time</Text>
            <View className="border border-border rounded-lg">
              <RNPickerSelect
                onValueChange={handleTimeSlotChange}
                items={TIME_SLOTS}
                placeholder={{ label: 'Select a time', value: null }}
                value={state.selectedTimeSlots[0]?.value}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>
          <View className="mb-4">
            <Text className="text-textprimary font-outfit-bold text-base mb-2">Quantity</Text>
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                className="w-10 h-10 bg-primary rounded-full items-center justify-center"
                onPress={() => setState(prev => ({
                  ...prev,
                  quantity: Math.max(1, prev.quantity - 1)
                }))}
              >
                <Ionicons name="remove" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <Text className="text-textprimary font-outfit-bold text-lg mx-6">{state.quantity}</Text>
              <TouchableOpacity
                className="w-10 h-10 bg-primary rounded-full items-center justify-center"
                onPress={() => setState(prev => ({
                  ...prev,
                  quantity: prev.quantity + 1
                }))}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-border">
        <TouchableOpacity
          className={`p-4 rounded-lg ${(!state.selectedPlan || !state.selectedTimeSlots.length) ? 'bg-gray-300' : 'bg-primary'}`}
          onPress={handleSubmit}
          disabled={!state.selectedPlan || !state.selectedTimeSlots.length || state.isLoading}
        >
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-outfit-bold text-center text-lg">
              ${calculateTotal().total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
    paddingLeft: 30,
    backgroundColor: '#fff',
  },
  inputWeb: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  placeholder: {
    color: '#999',
  },
};

export default MealCustomizeScreen;