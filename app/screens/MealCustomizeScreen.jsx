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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

// Custom Picker Component with NativeWind
const CustomPicker = ({ items, selectedValue, onValueChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View>
      <TouchableOpacity
        className="flex-row justify-between items-center py-3 px-4 border border-gray-200 rounded-lg bg-white"
        onPress={() => setIsOpen(true)}
      >
        <Text className={`text-base font-outfit ${selectedItem ? 'text-gray-800' : 'text-gray-400'}`}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            {/* Header */}
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
              <Text className="text-lg font-outfit-bold text-gray-800">
                {placeholder}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <ScrollView className="max-h-96">
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  className={`p-4 border-b border-gray-100 ${
                    selectedValue === item.value ? 'bg-green-50' : 'bg-white'
                  }`}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className={`text-base font-outfit ${
                      selectedValue === item.value ? 'text-green-600 font-outfit-bold' : 'text-gray-800'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
                      <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MealCustomizeScreen = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const params = useLocalSearchParams();
  const firmId = params.firmId || params.firm || params.id;
  const img = params.img;
  const restaurantName = params.restaurantName;
  const mealItem = params.mealItem ? JSON.parse(params.mealItem) : null;
  
  console.log('Restaurant ID:', firmId);
  console.log('Restaurant Image:', img);
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
      label: `${plan.label} ${plan.label === '1' ? 'Day' : 'Days'}`,
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
      selectedTimeSlots: [value]
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
      
      let endDate;
      if (state.selectedPlan.days <= 1) {
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
          basePrice: state.selectedPlan.price,
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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-5 border-b border-gray-200 bg-white shadow-sm">
        <Text className="text-gray-800 font-outfit-bold text-xl flex-1 text-center">
          Customize Your Meal
        </Text>
        <TouchableOpacity 
          onPress={handleClose} 
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-32">
          {/* Meal Item Display */}
          {mealItem && (
            <View className="flex-row mt-2.5 p-2.5 bg-white rounded-lg mb-4 shadow-sm">
              <Image
                source={typeof img === 'string' ? { uri: img } : img || require('@/assets/images/food_placeholder.jpg')}
                className="w-[100px] h-[100px] rounded-lg border border-gray-800 mr-5"
                resizeMode="cover"
                defaultSource={require('@/assets/images/food_placeholder.jpg')}
              />
              <View className="flex-1 flex-col">
                <Text className="text-lg font-outfit-bold text-gray-800 mb-1">
                  {mealItem.name}
                </Text>
                <Text className="text-base font-outfit-medium text-green-600 mb-2">
                  {state.selectedPlan ? (
                    <>
                      Price: ${state.selectedPlan.price.toFixed(2)}
                      {state.selectedPlan.days > 1 && (
                        <Text className="text-sm text-gray-600">
                          {' '}({state.selectedPlan.days} days)
                        </Text>
                      )}
                    </>
                  ) : (
                    `Base Price: $${(mealItem?.basePrice || 0).toFixed(2)}`
                  )}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {mealItem.description}
                </Text>
              </View>
            </View>
          )}

          {/* Customization Form */}
          <View>
            {/* Plan Type Selection */}
            <View className="mb-2.5">
              <Text className="text-base font-outfit-medium text-gray-700 mb-3">
                Plan Type
              </Text>
              <CustomPicker
                items={Plan_TYPES}
                selectedValue={state.selectedPlan?.value}
                onValueChange={handlePlanChange}
                placeholder="Select a plan type"
              />
              {state.selectedPlan && state.selectedPlan.discount > 0 && (
                <Text className="text-sm font-outfit-bold text-green-600 mt-2 text-right">
                  {state.selectedPlan.discountText}
                </Text>
              )}
            </View>

            {/* Date Selection */}
            {state.selectedPlan && (
              <View className="mb-2.5">
                <Text className="text-base font-outfit-medium text-gray-700 mb-3">
                  {getInstructionText()}
                </Text>
                
                {state.dateRange.startDate && (
                  <Text className="text-sm font-outfit-bold text-green-600 text-center mb-3">
                    {state.dateRange.startDate}
                    {calculateEndDate() && ` to ${calculateEndDate()}`}
                  </Text>
                )}

                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                  onPress={() => {
                    setTempSelectedDates({
                      startDate: state.dateRange.startDate,
                      endDate: state.dateRange.endDate,
                      flexibleDates: state.flexibleDates
                    });
                    setShowCalendarModal(true);
                  }}
                >
                  <Text className="text-base font-outfit-medium text-gray-800">
                    {state.dateRange.startDate
                      ? `${state.dateRange.startDate} ${calculateEndDate() ? `to ${calculateEndDate()}` : ''}`
                      : 'Select dates'}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            )}

            {/* Calendar Modal */}
            <Modal
              visible={showCalendarModal}
              animationType="slide"
              transparent={true}
              onRequestClose={handleCancelDates}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-xl p-5 w-[90%] max-h-[80%]">
                  <Calendar
                    markedDates={getMarkedDates(tempSelectedDates)}
                    onDayPress={handleTempDayPress}
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
                      textDayFontSize: 12,
                      textMonthFontSize: 15,
                      textDayHeaderFontSize: 14,
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <View className="flex-row justify-between mt-5">
                    <TouchableOpacity
                      className="py-3 px-6 rounded-lg min-w-[120px] items-center bg-gray-100 border border-gray-200"
                      onPress={handleCancelDates}
                    >
                      <Text className="font-outfit-medium text-base text-gray-800">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-3 px-6 rounded-lg min-w-[120px] items-center bg-green-600"
                      onPress={handleApplyDates}
                      disabled={!tempSelectedDates.startDate}
                    >
                      <Text className="font-outfit-medium text-base text-white">
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Delivery Time Slot */}
            <View className="mb-2.5">
              <Text className="text-base font-outfit-medium text-gray-700 mb-3">
                Delivery Time
              </Text>
              <CustomPicker
                items={TIME_SLOTS}
                selectedValue={state.selectedTimeSlots[0]}
                onValueChange={handleTimeSlotChange}
                placeholder="Select a time slot"
              />
            </View>

            {/* Quantity Selector */}
            <View className="mb-2.5">
              <Text className="text-base font-outfit-medium text-gray-700 mb-3">
                Quantity
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-lg self-start bg-white">
                <TouchableOpacity
                  className="p-3.5 bg-gray-50"
                  onPress={() => setState(prev => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1)
                  }))}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text className="text-base font-outfit-medium text-gray-800 px-5 min-w-[30px] text-center">
                  {state.quantity}
                </Text>
                <TouchableOpacity
                  className="p-3.5 bg-gray-50"
                  onPress={() => setState(prev => ({
                    ...prev,
                    quantity: prev.quantity + 1
                  }))}
                >
                  <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Breakdown */}
            {state.selectedPlan && (
              <View className="my-4 p-4 bg-gray-50 rounded-lg">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-base font-outfit-medium text-gray-600">
                    Subtotal
                  </Text>
                  <Text className="text-base font-semibold text-gray-800">
                    ${calculateTotal().subtotal.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-base font-outfit-medium text-gray-600">
                    Quantity
                  </Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {state.quantity}
                  </Text>
                </View>
                {state.selectedPlan.discount > 0 && (
                  <Text className="mt-1 text-base font-outfit-medium text-green-600 text-center">
                    You save {state.selectedPlan.discount}%!
                  </Text>
                )}
                <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
                  <Text className="text-lg font-outfit-bold text-gray-800">
                    Total
                  </Text>
                  <Text className="text-lg font-outfit-bold text-green-600">
                    ${calculateTotal().total.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex-row justify-between shadow-lg">
        <View className="flex-1">
          <Text className="text-sm font-outfit text-gray-600 mb-1">
            Total Amount
          </Text>
          <Text className="text-xl font-outfit-bold text-green-600">
            ${calculateTotal().total.toFixed(2)}
          </Text>
        </View>
        
        <TouchableOpacity
          className={`${
            (!state.selectedPlan || !state.selectedTimeSlots.length || !state.dateRange.startDate)
              ? 'bg-gray-300'
              : 'bg-green-600'
          } rounded-xl p-4 items-center flex-1 ml-2.5 justify-center`}
          onPress={handleSubmit}
          disabled={!state.selectedPlan || !state.selectedTimeSlots.length || !state.dateRange.startDate || state.isLoading}
        >
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-outfit-medium text-base">
              Add to Cart
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealCustomizeScreen;
