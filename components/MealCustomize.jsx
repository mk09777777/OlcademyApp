import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';

const MealCustomizationModal = ({
  visible = false,
  onClose = () => { },
  onSubmit = () => { },
  mealItem = null,
  planTypes = [],
  timeSlots = [],
  preferences = {}
}) => {
  const [state, setState] = useState({
    selectedPlan: null,
    selectedTimeSlots: [],
    selectedAddons: [],
    dateRange: { startDate: null, endDate: null },
    flexibleDates: [],
    dailyPlans: {},
    mealPrefs: {},
    quantity: 1,
    isLoading: false,
  });

  // Transform plan types for the picker
  const Plan_TYPES = planTypes.map(plan => ({
    label: `${plan.label} ($${plan.price.toFixed(2)})`,
    value: plan.id || plan.value,
    price: plan.price || 0,
    priceMultiplier: plan.priceMultiplier || 1,
    discount: plan.discount || 0,
    discountText: plan.discountText || 'No discount',
    days: parseInt(plan.label) || 1
  }));

  // Transform time slots for the picker
  const TIME_SLOTS = timeSlots.map(slot => ({
    label: slot.time || slot.label,
    value: slot.id || slot.value,
    key: slot.id || slot.key
  }));

  useEffect(() => {
    if (visible) {
      console.log("Meal Item:", mealItem);
      console.log("Plan Types:", Plan_TYPES);
      console.log("Time Slots:", TIME_SLOTS);
    }
  }, [visible, mealItem, Plan_TYPES, TIME_SLOTS]);

  // Get available addons from the meal item
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

  const PREFERENCES = {
    spiceLevel: (preferences.spiceLevel || ['Mild', 'Medium', 'Spicy'])
      .map(item => typeof item === 'string' ? { label: item, value: item.toLowerCase() } : item),
    riceType: (preferences.riceType || ['Plain Rice', 'Jeera Rice', 'Brown Rice'])
      .map(item => typeof item === 'string' ? { label: item, value: item.toLowerCase().replace(/\s+/g, '-') } : item),
    rotiType: (preferences.rotiType || ['Plain Roti', 'Butter Roti', 'Tandoori Roti'])
      .map(item => typeof item === 'string' ? { label: item, value: item.toLowerCase().replace(/\s+/g, '-') } : item)
  };

  const resetState = useCallback(() => {
    setState({
      selectedPlan: null,
      selectedTimeSlots: [],
      selectedAddons: [],
      dateRange: { startDate: null, endDate: null },
      flexibleDates: [],
      dailyPlans: {},
      mealPrefs: {},
      quantity: 1,
      isLoading: false
    });
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handlePlanChange = (value) => {
    const selectedPlan = Plan_TYPES.find(plan => plan.value === value);
    setState(prev => ({
      ...prev,
      selectedPlan,
      dateRange: { startDate: null, endDate: null },
      flexibleDates: []
    }));
  };

  const handleDayPress = (day) => {
    if (!day || !state.selectedPlan) return;

    const selectedDate = day.dateString;
    const daysInPlan = state.selectedPlan.days || 1;

    if (daysInPlan === 1) {
      setState(prev => ({
        ...prev,
        dateRange: { startDate: selectedDate, endDate: selectedDate },
        flexibleDates: [selectedDate],
      }));
    } else {
      const start = new Date(selectedDate);
      const end = new Date(start);
      end.setDate(start.getDate() + daysInPlan - 1);

      setState(prev => ({
        ...prev,
        dateRange: { startDate: selectedDate, endDate: end.toISOString().split('T')[0] },
        flexibleDates: generateDateRange(selectedDate, end.toISOString().split('T')[0]),
      }));
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

  const getMarkedDates = () => {
    if (!state.selectedPlan) return {};

    const marked = {};

    if (state.dateRange.startDate) {
      marked[state.dateRange.startDate] = {
        startingDay: true,
        color: '#4CAF50',
        textColor: 'white',
      };
    }

    if (state.dateRange.endDate) {
      marked[state.dateRange.endDate] = {
        endingDay: true,
        color: '#4CAF50',
        textColor: 'white',
      };
    }

    if (state.dateRange.startDate && state.dateRange.endDate) {
      const range = generateDateRange(state.dateRange.startDate, state.dateRange.endDate);
      range.forEach(date => {
        if (date !== state.dateRange.startDate && date !== state.dateRange.endDate) {
          marked[date] = {
            color: '#E8F5E9',
            textColor: '#2E7D32',
          };
        }
      });
    }

    return marked;
  };

  const calculateTotal = () => {
    if (!mealItem || !state.selectedPlan) {
      return {
        subtotal: 0,
        discount: 0,
        total: 0
      };
    }

    // Ensure we have valid numbers for calculations
    const planPrice = state.selectedPlan.price || mealItem.basePrice || 0;
    const daysInPlan = state.selectedPlan.days || 1;
    const quantity = state.quantity || 1;
    const discountPercent = state.selectedPlan.discount || 0;

    let subtotal = planPrice * daysInPlan * quantity;

    // Add addons
    const addonsTotal = state.selectedAddons.reduce((sum, addon) =>
      sum + ((addon?.price || 0) * daysInPlan * quantity), 0);
    subtotal += addonsTotal;

    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      total
    };
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

      // Validate inputs
      if (!mealItem) throw new Error('No meal item selected');
      if (!state.selectedPlan) throw new Error('Please select a plan');
      if (!state.selectedTimeSlots || state.selectedTimeSlots.length === 0) {
        throw new Error('Please select at least one time slot');
      }
      if (!state.dateRange.startDate) throw new Error('Please select dates');

      const { total } = calculateTotal();

      const orderDetails = {
        id: mealItem.id,
        name: mealItem.name,
        price: total,
        quantity: state.quantity,
        image: mealItem.image,
        plan: state.selectedPlan,
        customization: {
          plan: state.selectedPlan,
          dates: state.flexibleDates,
          timeSlots: state.selectedTimeSlots,
          addons: state.selectedAddons,
          preferences: state.mealPrefs,
          basePrice: mealItem.basePrice,
          discount: state.selectedPlan.discount || 0
        },
        // Fields expected by the server
        productId: mealItem.id,
        restaurantId: mealItem.restaurantId || 'default-restaurant-id',
        foodType: 'regular',
        price: `$${total.toFixed(2)}`
      };

      console.log('Submitting order:', orderDetails);
      await onSubmit(orderDetails);
      handleClose();
    } catch (error) {
      console.error("Order submission failed:", error);
      Alert.alert('Error', error.message || 'Failed to submit order');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible, resetState]);

  const getInstructionText = () => {
    if (!state.selectedPlan) return 'Select a plan first';
    return `Select your start date for ${state.selectedPlan.label} plan`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-outfit-bold color-gray-900">Customize Your Meal</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {mealItem && (
            <View className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Text className="text-lg font-outfit-bold color-gray-900">{mealItem.name}</Text>
              <Text className="text-xl font-outfit-bold color-primary mt-2">
                ${state.selectedPlan
                  ? state.selectedPlan.price.toFixed(2)
                  : (mealItem.basePrice || 0).toFixed(2)}
              </Text>
              <Text className="text-sm color-gray-600 font-outfit mt-2">{mealItem.description}</Text>
            </View>
          )}

          <View>
            <View className="mb-6">
              <Text className="text-base font-outfit-bold color-gray-900 mb-3">Plan Type</Text>
              <View className="border border-gray-200 rounded-lg">
                <RNPickerSelect
                  onValueChange={handlePlanChange}
                  items={Plan_TYPES}
                  placeholder={{ label: 'Select a plan type', value: null }}
                  value={state.selectedPlan?.value}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              {state.selectedPlan && (
                <Text className="text-sm color-green-600 font-outfit mt-2">
                  {state.selectedPlan.discountText}
                </Text>
              )}
            </View>

            {state.selectedPlan && (
              <View className="mb-6">
                <Text className="text-base font-outfit-bold color-gray-900 mb-3">{getInstructionText()}</Text>
                <Calendar
                  className="border border-gray-200 rounded-lg"
                  markedDates={getMarkedDates()}
                  onDayPress={handleDayPress}
                  markingType="period"
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    selectedDayBackgroundColor: '#4CAF50',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#4CAF50',
                    dotColor: '#4CAF50',
                    arrowColor: '#4CAF50',
                    monthTextColor: '#333',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                    backgroundColor: '#ffffff'
                  }}
                />
              </View>
            )}

            <View className="mb-6">
              <Text className="text-base font-outfit-bold color-gray-900 mb-3">Delivery Time</Text>
              <View className="border border-gray-200 rounded-lg">
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

            {ADDONS.length > 0 && (
              <View className="mb-6">
                <Text className="text-base font-outfit-bold color-gray-900 mb-3">Add Extra Items</Text>
                <View className="flex-row flex-wrap gap-2">
                  {ADDONS.map((addon) => (
                    <TouchableOpacity
                      key={addon.key}
                      className={`px-4 py-2 rounded-lg border ${
                        state.selectedAddons.some(a => a.value === addon.value)
                          ? 'bg-primary border-primary'
                          : 'bg-white border-gray-200'
                      }`}
                      onPress={() => {
                        setState(prev => {
                          const isSelected = prev.selectedAddons.some(a => a.value === addon.value);
                          return {
                            ...prev,
                            selectedAddons: isSelected
                              ? prev.selectedAddons.filter(a => a.value !== addon.value)
                              : [...prev.selectedAddons, addon]
                          };
                        });
                      }}
                    >
                      <Text className={`text-sm font-outfit ${
                        state.selectedAddons.some(a => a.value === addon.value)
                          ? 'text-white'
                          : 'color-gray-700'
                      }`}>{addon.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View className="mb-6">
              <Text className="text-base font-outfit-bold color-gray-900 mb-3">Quantity</Text>
              <View className="flex-row items-center justify-center bg-gray-100 rounded-lg p-2">
                <TouchableOpacity
                  className="p-2 bg-white rounded-lg"
                  onPress={() => setState(prev => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1)
                  }))}
                >
                  <Ionicons name="remove" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <Text className="text-lg font-outfit-bold color-gray-900 mx-6">{state.quantity}</Text>
                <TouchableOpacity
                  className="p-2 bg-white rounded-lg"
                  onPress={() => setState(prev => ({
                    ...prev,
                    quantity: prev.quantity + 1
                  }))}
                >
                  <Ionicons name="add" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-base color-gray-700 font-outfit mb-2">
                Subtotal: ${calculateTotal().subtotal.toFixed(2)}
              </Text>
              {calculateTotal().discount > 0 && (
                <Text className="text-base color-gray-700 font-outfit mb-2">
                  Discount: -${calculateTotal().discount.toFixed(2)}
                </Text>
              )}
              <Text className="text-lg font-outfit-bold color-primary">
                Total: ${calculateTotal().total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row p-4 border-t border-gray-200 gap-3">
          <TouchableOpacity
            className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
            onPress={handleClose}
          >
            <Text className="text-base font-outfit color-gray-700">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${
              (!state.selectedPlan || !state.selectedTimeSlots.length)
                ? 'bg-gray-300'
                : 'bg-primary'
            }`}
            onPress={handleSubmit}
            disabled={!state.selectedPlan || !state.selectedTimeSlots.length || state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-outfit-bold text-base">
                ${(state.selectedPlan?.price || mealItem?.basePrice || 0).toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: '#333',
    paddingRight: 30,
    backgroundColor: 'transparent',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#333',
    paddingRight: 30,
    paddingLeft: 15,
    backgroundColor: 'transparent',
  },
  inputWeb: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#333',
    paddingRight: 30,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  placeholder: {
    color: '#999',
  },
});

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
Original styles converted to NativeWind classes above
*/

export default MealCustomizationModal;