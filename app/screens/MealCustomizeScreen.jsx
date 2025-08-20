import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../../styles/mealCustomizationStyle';
import { useCart } from '@/context/CartContext';

const MealCustomizeScreen = () => {
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
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Customize Your Meal</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalScroll} contentContainerStyle={styles.scrollContent}>
      {/* <Image
  source={typeof img === 'string' ? { uri: img } : img || require('@/assets/images/food_placeholder.jpg')}
  style={styles.menuItemImage}
  resizeMode="cover"
  defaultSource={require('@/assets/images/food_placeholder.jpg')} 
/> */}
       {mealItem && (
          <View style={styles.mealContainer}>
            <Image
              source={typeof img === 'string' ? { uri: img } : img || require('@/assets/images/food_placeholder.jpg')}
              style={styles.menuItemImage}
              resizeMode="cover"
              defaultSource={require('@/assets/images/food_placeholder.jpg')}
            />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{mealItem.name}</Text>
              <Text style={styles.mealPrice}>
                {state.selectedPlan ? (
                  <>
                    Price: ${state.selectedPlan.price.toFixed(2)}
                    {state.selectedPlan.days > 1 && (
                      <Text style={styles.planDurationText}>
                        {' '}({state.selectedPlan.days} days)
                      </Text>
                    )}
                  </>
                ) : (
                  `Base Price: $${(mealItem?.basePrice || 0).toFixed(2)}`
                )}
              </Text>
              <Text style={styles.mealDescription}>{mealItem.description}</Text>
            </View>
          </View>
        )}

        <View style={styles.customizationForm}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Plan Type</Text>
            <View style={styles.dropdownContainer}>
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
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{getInstructionText()}</Text>
              <TouchableOpacity
                style={styles.datePreviewContainer}
                onPress={() => {
                  setTempSelectedDates({
                    startDate: state.dateRange.startDate,
                    endDate: state.dateRange.endDate,
                    flexibleDates: state.flexibleDates
                  });
                  setShowCalendarModal(true);
                }}
              >
                <Text style={styles.datePreviewText}>
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
            <View style={styles.calendarModalContainer}>
              <View style={styles.calendarModalContent}>
                <Calendar
                  style={styles.calendarContainer}
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
                <View style={styles.calendarButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.calendarButton, styles.cancelButton]}
                    onPress={handleCancelDates}
                  >
                    <Text style={styles.calendarButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.calendarButton, styles.applyButton]}
                    onPress={handleApplyDates}
                    disabled={!tempSelectedDates.startDate}
                  >
                    <Text style={styles.calendarButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Delivery Time</Text>
            <View style={styles.dropdownContainer}>
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
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setState(prev => ({
                  ...prev,
                  quantity: Math.max(1, prev.quantity - 1)
                }))}
              >
                <Ionicons name="remove" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{state.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
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

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!state.selectedPlan || !state.selectedTimeSlots.length) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!state.selectedPlan || !state.selectedTimeSlots.length || state.isLoading}
        >
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              ${calculateTotal().total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
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
});

export default MealCustomizeScreen;