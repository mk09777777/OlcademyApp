import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  SectionList,
  Pressable,
  TouchableWithoutFeedback
} from 'react-native';
import {
  MaterialIcons,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign
} from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';
import { Schedule } from '@/components/Schedule';
import AsyncStorage from '@react-native-async-storage/async-storage';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const TakeAwayCart = () => {
  const {
    cart,
    carts,
    getCartItems,
    handleQuantityChange,
    getSubtotal,
    handleRemove,
    taxDetails,
    gstAmount,
    restaurantInfo,
    calculateCartCount,
    fetchCart,
    loading: cartLoading
  } = useCart();
  const { api, user } = useAuth();
  const { offers } = useGlobalSearchParams();
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [groupedItems, setGroupedItems] = useState([]);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(null);
  const [appliedTaxes, setAppliedTaxes] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [manualPromoCode, setManualPromoCode] = useState('');
  const [allOffers, setAllOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [enableAll, setEnableAll] = useState(false);
  const [promosPush, setPromosPush] = useState(false);
  const [promosWhatsapp, setPromosWhatsapp] = useState(false);
  const [socialPush, setSocialPush] = useState(false);
  const [ordersPush, setOrdersPush] = useState(false);
  const [ordersWhatsapp, setOrdersWhatsapp] = useState(false);
  const initialState = useRef({
    enableAll: false,
    promosPush: false,
    promosWhatsapp: false,
    socialPush: false,
    ordersPush: false,
    ordersWhatsapp: false,
  });

  const address = taxDetails[0]?.address;
  const isTiffinOrder = cartItems.some(item => item.itemType === 'tiffin');
  const cartItemType = cartItems[0]?.sourceEntityName?.toLowerCase();
  const cartItemId = cartItems[0]?.sourceEntityId;
  const overallOtherTaxes =
    typeof carts?.overallOtherTaxes === "number" ? carts.overallOtherTaxes : 0;
  const allOtherChargesDetails = Array.isArray(carts?.allOtherChargesDetails)
    ? carts.allOtherChargesDetails
    : [];
  // console.log('sfjsj',allOtherChargesDetails)
  const taxDetail = Array.isArray(cart?.taxDetails) ? cart.taxDetails : [];
  const deliveryFee = carts?.deliveryFee || 0;
  const platformFee = carts?.overallPlatformFee || 0;
  const calculateTaxes = (taxes) => {
    const cartItems = getCartItems();
    if (!cartItems.length || !taxes.length) return [];

    const calculatedTaxes = [];
    const countryTaxMap = {};

    taxes.forEach((tax) => {
      if (!countryTaxMap[tax.country]) {
        countryTaxMap[tax.country] = [];
      }
      countryTaxMap[tax.country].push(tax);
    });

    cartItems.forEach((item) => {
      let country = "Default";
      if (item.restaurantInfo?.country) {
        country = item.restaurantInfo.country;
      } else if (item.country) {
        country = item.country;
      }

      const applicableTaxes = countryTaxMap[country] || [];

      if (applicableTaxes.length) {
        applicableTaxes.forEach((tax) => {
          const itemPrice = parseFloat(item.price) * item.quantity;
          const taxAmount = (tax.rate / 100) * itemPrice;

          const existingTaxIndex = calculatedTaxes.findIndex(
            (t) => t.country === country && t.type === tax.type
          );

          if (existingTaxIndex > -1) {
            calculatedTaxes[existingTaxIndex].amount += taxAmount;
          } else {
            calculatedTaxes.push({
              country: country,
              type: tax.type,
              rate: tax.rate,
              amount: taxAmount,
              description: tax.description,
            });
          }
        });
      }
    });

    setAppliedTaxes(calculatedTaxes);
  };
  const dateLabels = ['Today', 'Tomorrow', 'Day After'];
  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('selectedAddress');
        if (savedAddress) {
          const addressData = JSON.parse(savedAddress);
          setPickupAddress(addressData.fullAddress || '');
        }
      } catch (error) {
        console.error('Error loading saved address:', error);
      }
    };

    loadSavedAddress();
  }, []);
  console.log('select', pickupAddress)
  const fetchOffers = async () => {
    try {
      let offers = [];

      if (cartItemType === 'tiffin') {
        const response = await api.get(`/api/tiffin/offers/${cartItemId}`, { withCredentials: true });
        offers = response.data.map(offer => ({
          ...offer,
          source: 'tiffin',
          offerType: offer.type || 'fixed',
          discountValue: offer.discount || 0
        }));
      } else {
        const productIds = cartItems.map((item) => item.productId || item._id).join(",");
        const subcategoryIds = cartItems.map((item) => item.subcategoryId).filter(Boolean).join(",");
        const categoryId = cartItems.map((item) => item.categoryId).filter(Boolean).join(",");

        const response = await api.get(
          `/api/offers/takeaway/cart/apply-offers?firmId=${cartItemId}&productIds=${productIds}&categoryId=${categoryId}&subcategoryIds=${subcategoryIds}`,
          { withCredentials: true },
        );

        offers = response.data.map(offer => ({
          ...offer,
          source: 'restaurant',
          offerType: offer.offerType || offer.type || 'fixed',
          discountValue: offer.discountValue || offer.discount || 0,
          name: offer.name || offer.itemName || `Offer ${offer.code}`,
          code: offer.code,
          endDate: offer.endDate
        }));
      }

      const combinedOffers = offers.filter(offer =>
        offer.discountValue > 0 && !isCouponExpired(offer.endDate)
      );
      // const combinedOffers = offers;

      setAllOffers(combinedOffers);
      setFilteredOffers(combinedOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setAllOffers([]);
      setFilteredOffers([]);
    }
  };

  const fetchInitialSettings = async () => {
    try {
      const response = await api.get('/api/getnotifications', { withCredentials: true });
      const settings = response.data;

      setEnableAll(settings.enableAll);
      setPromosPush(settings.promoPush);
      setPromosWhatsapp(settings.promoWhatsapp);
      setSocialPush(settings.socialPush);
      setOrdersPush(settings.orderPush);
      setOrdersWhatsapp(settings.orderWhatsapp);

      initialState.current = {
        enableAll: settings.enableAll,
        promosPush: settings.promoPush,
        promosWhatsapp: settings.promoWhatsapp,
        socialPush: settings.socialPush,
        ordersPush: settings.orderPush,
        ordersWhatsapp: settings.orderWhatsapp,
      };
    } catch (error) {
      console.error("Error fetching notification settings", error);
    }
  };

  useEffect(() => {

    fetchInitialSettings()
  }, [enableAll, promosPush, promosWhatsapp, socialPush, ordersPush, ordersWhatsapp])

  const isCouponExpired = (endDate) => {
    if (!endDate) return true;
    const now = new Date();
    const couponEnd = new Date(endDate);
    return now > couponEnd;
  };

  const formatPromoDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleApplyOffer = (offer) => {
    if (!offer || !offer.discountValue) {
      Alert.alert('Error', 'Invalid offer');
      return;
    }

    // Ensure the offer has all required fields
    const validOffer = {
      ...offer,
      code: offer.code || `OFFER-${Math.random().toString(36).substr(2, 5)}`,
      offerType: offer.offerType || 'fixed',
      discountValue: offer.discountValue || 0,
      _id: offer._id || null
    };

    setAppliedOffer(validOffer);
    setIsPromoOpen(false);
  };

  const handleManualCodeApply = () => {
    if (!manualPromoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    const matchedOffer = allOffers.find(
      offer => offer.code && offer.code.toLowerCase() === manualPromoCode.toLowerCase()
    );

    if (matchedOffer) {
      if (isCouponExpired(matchedOffer.endDate)) {
        Alert.alert('Error', 'This coupon has expired');
      } else {
        handleApplyOffer(matchedOffer);
      }
    } else {
      Alert.alert('Error', 'Invalid promo code or no matching offer found');
    }
  };

  useEffect(() => {
    const items = getCartItems().map(item => ({
      ...item,
      id: item.productId || item._id || item.id,
      img: item.img || '@/assets/images/food_placeholder.jpg',
    }));
    setCartItems(items);

    const groups = {};
    items.forEach((item) => {
      const restaurantId = item?.sourceEntityId;
      const restaurantName = taxDetails[0]?.name || 'Figo';
      if (!groups[restaurantId]) {
        groups[restaurantId] = {
          id: restaurantId,
          name: restaurantName,
          address: taxDetails[0]?.address || '',
          image: taxDetails[0]?.image || '',
          data: [],
        };
      }
      groups[restaurantId].data.push(item);
    });

    setGroupedItems(Object.values(groups));
    calculateTaxes(taxDetails);

  }, [cart, getCartItems, taxDetails]);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchOffers();
    }
  }, [cartItems]);

  useEffect(() => {
    if (offers && typeof offers === 'string') {
      try {
        const parsedOffer = JSON.parse(offers);
        if (parsedOffer?.code) {
          setAppliedOffer(parsedOffer);
        }
      } catch (error) {
        console.error('Error parsing offer:', error);
        setAppliedOffer(null);
      }
    } else {
      setAppliedOffer(null);
    }
  }, [offers]);

  const calculateTotalTaxes = () => {
    return appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);
  };

  const subtotal = parseFloat(getSubtotal() || 0);
  let discount = 0;

  if (appliedOffer) {
    if (appliedOffer.scope === "MealType-specific") {
      cartItems?.forEach(cartItem => {
        const currentMealTypeId = cartItem.mealType?.id;
        appliedOffer.mealTypes?.forEach(offerMealType => {
          if (offerMealType?.mealTypeId?.toString() === currentMealTypeId) {
            if (appliedOffer.offerType === "percentage") {
              discount += (cartItem.price * cartItem.quantity * appliedOffer.discountValue) / 100;
            } else {
              discount += Math.min((cartItem.price * cartItem.quantity), appliedOffer.discountValue);
            }
          }
        });
      });
    } else if (appliedOffer.scope === 'MealPlan-Specific') {
      cartItems?.forEach(cartItem => {
        const currentMealPlanId = cartItem.selectedPlan?.id;
        appliedOffer.mealPlans?.forEach(offerMealPlan => {
          if (offerMealPlan?.toString() === currentMealPlanId) {
            if (appliedOffer.offerType === "percentage") {
              discount += (cartItem.price * cartItem.quantity * appliedOffer.discountValue) / 100;
            } else {
              discount += Math.min((cartItem.price * cartItem.quantity), appliedOffer.discountValue);
            }
          }
        });
      });
    } else {
      if (appliedOffer.offerType === "percentage") {
        discount = subtotal * (appliedOffer.discountValue) / 100;
      } else {
        discount = appliedOffer.discountValue;
      }
    }

    discount = Math.min(discount, subtotal);
  }
  const aggregatedOtherTaxesForDisplay = taxDetails.flatMap((td) =>
    td.appliedTaxes.filter((tax) => tax.name?.toLowerCase() !== "gst")
  );
  const OtherTaxesForDisplay = allOtherChargesDetails?.filter((tax) => tax.name?.toLowerCase() !== "platformfee");
  console.log(OtherTaxesForDisplay);
  const combinedAllOtherChargesAndTaxes = [
    ...aggregatedOtherTaxesForDisplay.map(tax => ({
      name: tax.name,
      amount: tax.amount,
      type: 'tax'
    })),
    ...OtherTaxesForDisplay.map(tax => ({
      name: tax.name,
      amount: tax.value,
      type: 'othertax'
    }))
  ];
  const taxesTotal = calculateTotalTaxes() || 0;
  const total = Number(
    (subtotal - discount) +
    deliveryFee +
    // platformFee +
    overallOtherTaxes +
    carts.overallOtherCharges +
    (carts?.taxDetails?.[0]?.gstAmount || 0)

  );

  const isCartEmpty = cartItems.length === 0;

  // if (cartItems.length === 0) {
  //   return (
  //     <View>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  const handlePlaceOrder = async () => {
    try {
      const cartItems = getCartItems();

      if (cartItems.length === 0) {
        Alert.alert('Error', 'Your cart is empty');
        return;
      }

      const firstSourceEntityId = cartItems[0]?.sourceEntityId;
      const allSameSource = cartItems.every(item =>
        item?.sourceEntityId?.toString() === firstSourceEntityId?.toString()
      );

      if (!allSameSource) {
        Alert.alert('Error', 'All items must be from the same restaurant');
        return;
      }
      let deliveryTimeToSend = null;
      let pickupAddressToSend = null;
      if (cartItemType === 'tiffin') {
        const selectedTiffinDeliveryTimeSlot = cartItems[0]?.selectedDeliveryTimeSlot;

        if (!selectedTiffinDeliveryTimeSlot) {
          Alert.alert("Tiffin delivery time slot not found in cart. Please go back and select a slot when adding to cart.");
          return;
        }
        if (!phoneNumber.trim()) {
          Alert.alert("Please enter your phone number for tiffin order.");
          return;
        }
        if (!pickupAddress.trim()) {
          Alert.alert("Please enter a pickup address for tiffin order.");
          return;
        }

        deliveryTimeToSend = selectedTiffinDeliveryTimeSlot;
        pickupAddressToSend = pickupAddress;
      } else {
        if (!selectedScheduleTime) {
          Alert.alert("Please select a pickup time for your order (Standard or Schedule).");
          return;
        }
        deliveryTimeToSend = selectedScheduleTime;
        pickupAddressToSend = address;
      }
      const orderTime = new Date();
      orderTime.setMinutes(orderTime.getMinutes() + 1);

      const orderData = {
        // items: cartItems.map(item => ({
        //   productId: item.productId || item._id,
        //   name: item.name,
        //   description: item.description,
        //   img: item.img,
        //   quantity: item.quantity,
        //   price: item.price,
        //   foodType: item.foodType,
        //   itemType: item.itemType,
        //   productModelType: item.productModelType,
        //   sourceEntityId: item.sourceEntityId,
        //   sourceEntityName: item.sourceEntityName,
        //   _id: item._id,
        //   productName: item.productName,
        //   ...(isTiffinOrder && { selectedDeliveryTimeSlot: selectedScheduleTime })
        // })),
        items: cartItems,
        restaurantName: firstSourceEntityId,
        deliveryFee: deliveryFee,
        subtotal: subtotal,
        platformFee: platformFee,
        totalPrice: total,
        gstCharges: carts.taxDetails?.[0]?.gstAmount || 0,
        totalOtherCharges: combinedAllOtherChargesAndTaxes,
        offerId: appliedOffer?._id || undefined,
        discount: discount,
        orderTime: orderTime.toISOString(),
        deliveryTime: deliveryTimeToSend,
        pickupAddress: pickupAddressToSend || taxDetails[0]?.address || "Restaurant Address",
        sourceEntityDetails: {
          name: taxDetails[0]?.name || 'Restaurant',
          address: taxDetails[0]?.address || '',
          city: taxDetails[0]?.country || '',
          image: taxDetails[0]?.image || '',
          itemType: taxDetails[0]?.itemType || 'Firm'
        },
      };

      if (cartItemType === 'tiffin') {
        orderData.phone = {
          countryCode: countryCode,
          number: phoneNumber,
        };
        orderData.specialInstructions = specialInstructions;
      }

      const response = await api.post('/api/create', orderData, { withCredentials: true });
      console.log(response)
      if (response.data.success) {
        UploadNotifications(orderData)
        await fetchCart();


        router.push({
          pathname: '/screens/OrderSceess',
          params: {
            orderId: response.data.data.order._id,
            totalAmount: total.toFixed(2),
            restaurantName: taxDetails[0]?.name || 'Rest',
            autoRedirect: 'true'
          }
        });
      } else {
        throw new Error(response.data.error || 'Order failed');
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      let errorMessage = error.message;

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert(
        'Order Failed',
        errorMessage || 'Could not place order. Please try again.'
      );
    }
  };

  const UploadNotifications = async (order) => {
    try {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      const restaurantName = order.sourceEntityDetails?.name || 'Restaurant';
      const orderTime = order.orderTime;
      const deliveryType = order.deliveryTime ? 'delivery' : 'pickup';
      const scheduledTime = order.deliveryTime || 'soon';

      const uploadData = {
        title: "Order Confirmed",
        description: `Your order from ${restaurantName} ($${order.totalPrice.toFixed(2)}) is confirmed. Expected ${deliveryType} at ${scheduledTime}`,
        time: formattedTime,
      };
      const response = await axios.post("http://192.168.0.100:3000/api/postNotificationsInfo", uploadData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: uploadData.title,
          body: uploadData.description,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: 1,
        },
      });
      console.log("✅ Notification saved:", response.data);
    } catch (error) {
      console.log("❌ Error in uploading the notification", error.message);
    }
  };

  const renderRestaurantHeader = ({ section }) => (
    <View className="flex-row items-center p-4 bg-white border-b border-border">
      {section.image && (
        <Image
          source={{ uri: section.image }}
          className="w-12 h-12 rounded-lg mr-3"
        />
      )}
      <View className="flex-1">
        <Text className="text-textprimary font-outfit-bold text-base" numberOfLines={1} ellipsizeMode="tail">
          {section.name}
        </Text>
        <Text className="text-textsecondary font-outfit text-sm" numberOfLines={2} ellipsizeMode="tail">
          {section.address}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="flex-row items-center p-3 bg-white border-b rounded-lg border-border">
      <View className="flex-1">
        <Text className="text-textprimary font-outfit-bold text-base mb-1">{item.name}</Text>
        <Text className="text-textsecondary font-outfit text-sm mb-1">
          Item Price:- ${(item.price || 0).toFixed(2)}
        </Text>
        <Text className="text-primary font-outfit-bold text-sm">
          Total Item Price:- ${subtotal.toFixed(2)}
        </Text>
      </View>

      {/* Quantity and Delete Controls */}
      <View className="flex-row items-center ml-2">
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.productId || item._id || item.id, -1)}
          className="w-6 h-6 bg-primary rounded items-center justify-center mr-1"
        >
          <Text className="text-white font-outfit-bold">-</Text>
        </TouchableOpacity>

        <Text className="text-textprimary font-outfit-bold text-base mx-2">
          {item.quantity}
        </Text>

        <TouchableOpacity
          onPress={() => handleQuantityChange(item.productId || item._id || item.id, 1)}
          className="w-6 h-6 bg-primary rounded items-center justify-center mr-2"
        >
          <Text className="text-white font-outfit-bold">+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleRemove(item.productId || item._id || item.id)}
          className="p-2"
        >
          <MaterialIcons name="delete-outline" size={24} color="#02757A" />
        </TouchableOpacity>
      </View>
    </View>


  );
  const renderPromoModal = () => (
    <Modal
      visible={isPromoOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsPromoOpen(false)}
    >
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-white rounded-lg p-5 mx-4 max-h-4/5">
          <Text className="text-textprimary font-outfit-bold text-xl mb-5">Promotions</Text>

          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <TextInput
              placeholder="Enter promo code"
              value={manualPromoCode}
              onChangeText={setManualPromoCode}
              className="flex-1 border border-border rounded-lg p-3 mr-2 text-textprimary font-outfit"
            />
            <TouchableOpacity
              className="bg-primary px-5 py-3 rounded-lg"
              onPress={handleManualCodeApply}
            >
              <Text className="text-white font-outfit-bold">Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <View key={`${offer._id}-${offer.source}`} className="bg-background p-4 rounded-lg mb-3 border border-border">
                  <Text className="text-textprimary font-outfit-bold text-base mb-1">{offer.name || `Offer ${offer.code}`}</Text>
                  {offer.code && <Text className="text-textsecondary font-outfit text-sm mb-1">Code: {offer.code}</Text>}
                  <Text className="text-primary font-outfit-bold text-sm mb-2">
                    Discount: {offer.offerType === "percentage"
                      ? `${offer.discountValue}%`
                      : `$${offer.discountValue.toFixed(2)}`}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text className="text-textsecondary font-outfit text-xs">
                      Valid until: {formatPromoDate(offer.endDate)}
                    </Text>
                    <TouchableOpacity
                      className="bg-primary px-3 py-1 rounded"
                      onPress={() => handleApplyOffer(offer)}
                    >
                      <Text className="text-white font-outfit text-sm">Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: '#666' }}>No available promotions</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            className="bg-border p-3 rounded-lg mt-5"
            onPress={() => setIsPromoOpen(false)}
          >
            <Text className="text-textprimary font-outfit-bold text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-center w-full mt-5">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-4 bottom-4">
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-textprimary text-xl font-outfit-bold mb-4">Your Cart</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-white ml-5 mr-5 rounded-lg p-4 mb-4 shadow-sm shadow-black">

          {cartItems.length === 0 ? (
            <View className="items-center py-12">
              <Image
                className="w-32 h-32 mb-4"
                source={require('@/assets/images/empty_cart.png')}
              />
              <Text className="text-textsecondary font-outfit text-lg">Your cart is empty!</Text>
            </View>
          ) : (
            <SectionList
              sections={groupedItems}
              keyExtractor={(item) => item.productId || item._id || item.id}
              renderItem={renderItem}
              renderSectionHeader={renderRestaurantHeader}
              scrollEnabled={false}
            />
          )}
        </View>
        <View className="bg-white ml-5 mr-5 mb-4 shadow-sm shadow-black rounded-lg">
          {!appliedOffer ? (
            <View className="flex-row">
              <TextInput
                placeholder="Enter promo code"
                value={manualPromoCode}
                onChangeText={setManualPromoCode}
                className="flex-1 border border-border rounded-l-lg p-3 text-textprimary font-outfit"
              />
              <TouchableOpacity
                className="bg-primary px-5 py-3 rounded-r-lg"
                onPress={handleManualCodeApply}
              >
                <Text className="text-white font-outfit-bold">Apply</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row justify-between items-center bg-green-50 p-3 rounded-lg">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-lg mr-2">🎉</Text>
                <Text className="text-green-700 font-outfit text-sm flex-1">
                  You saved ${discount.toFixed(2)} with '{appliedOffer.code || appliedOffer.name}'
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAppliedOffer(null)}
                className="w-6 h-6 bg-red-500 rounded-full items-center justify-center"
              >
                <Text className="text-white font-outfit-bold">×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="bg-white p-1 ml-5 mr-5 shadow-sm shadow-black mb-4 rounded-lg">
          <Text className="text-textprimary font-outfit-bold text-lg ml-5 mt-3 mb-4">Delivery Details</Text>
          <View>
            {/* Tiffin-specific fields */}
            {isTiffinOrder && (
              <View>
                <View style={{ marginTop: 10, marginBottom: 10, }}>
                  {cartItems[0]?.selectedDeliveryTimeSlot ? (
                    <View style={{
                      backgroundColor: '#ebf8ff',
                      borderColor: '#90cdf4',
                      borderWidth: 1,
                      borderRadius: 6,
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}>
                      <Text style={{ fontWeight: '600', fontSize: 16, color: '#2b6cb0' }}>
                        Delivery Time: {cartItems[0]?.selectedDeliveryTimeSlot}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{
                      color: '#718096',
                      textAlign: 'center',
                      paddingVertical: 16,
                      fontSize: 14,
                      backgroundColor: '#f7fafc',
                      borderRadius: 6,
                      borderColor: '#e2e8f0',
                      borderWidth: 1,
                    }}>
                      Delivery time not found for tiffin.
                    </Text>
                  )}
                </View>
                <View className="bg-white p-4 rounded-lg mb-4">
                  <Text className="text-textprimary font-outfit-bold text-lg mb-4">Delivery Details</Text>
                  <View className="mb-4">
                    <Text className="text-textprimary font-outfit-bold text-sm mb-2">Country Code</Text>
                    <View className="border border-border rounded-lg">
                      <Picker
                        selectedValue={countryCode}
                        className="h-12"
                        onValueChange={(itemValue) => setCountryCode(itemValue)}
                      >
                        <Picker.Item label="India (+91)" value="+91" />
                        <Picker.Item label="USA (+1)" value="+1" />
                        <Picker.Item label="UK (+44)" value="+44" />
                      </Picker>
                    </View>
                  </View>
                  <TextInput
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    className="border border-border rounded-lg p-3 text-textprimary font-outfit mb-4"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/screens/DeliveryAddress')}
                  className="mb-4"
                >
                  <TextInput
                    placeholder="Delivery Address"
                    value={pickupAddress}
                    onChangeText={setPickupAddress}
                    multiline
                    className="border border-border rounded-lg p-3 text-textprimary font-outfit h-24"
                    editable={false}
                  />
                  {pickupAddress ? (
                    <TouchableOpacity
                      onPress={async () => {
                        setPickupAddress('');
                        await AsyncStorage.removeItem('selectedAddress');
                      }}
                    >
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                <TextInput
                  placeholder="Special Instructions"
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                  multiline
                  className="border border-border rounded-lg p-3 text-textprimary font-outfit h-20"
                />
              </View>
            )}

            {/* Restaurant pickup details */}
            {!isTiffinOrder && (
              <View className="">
                {/* Delivery/Pickup Time Section */}
                <Pressable onPress={() => setScheduleModalVisible(true)}>
                  <View className="flex-row items-center p-4">
                    <Feather name="clock" size={20} color="#333" />
                    <View className="flex-1 ml-3">
                      <Text className="text-textprimary font-outfit-bold text-base">Pickup Time</Text>
                      <Text className="text-textsecondary font-outfit text-sm">
                        Standard (Approx. 30 Mins)
                      </Text>
                      <Text className="text-textsecondary font-outfit text-xs">
                        {
                          selectedScheduleTime
                            ? `Scheduled: ${new Date(selectedScheduleTime).toLocaleDateString("en-IN", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })} at ${new Date(selectedScheduleTime).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                            : "Schedule for later"
                        }
                      </Text>
                    </View>
                    <Entypo name="chevron-right" size={20} color="#aaa" />
                  </View>
                </Pressable>

                {/* Location Section */}
                <View className="flex-row items-center p-4">
                  <Feather name="map-pin" size={18} color="#333" className="mr-4" />
                  <View className="flex-1">
                    <Text className="text-textprimary font-outfit-bold text-base ml-3">Pickup Location</Text>
                    <Text className="text-textsecondary font-outfit text-sm ml-3">
                      {taxDetails[0]?.name || 'Restaurant Name'}
                    </Text>
                    <Text className="text-textsecondary font-outfit text-xs ml-3">
                      {taxDetails[0]?.address || '123 Main St, City, State'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Total Bill */}
            <TouchableOpacity className="flex-row items-center p-4" onPress={() => setBillModalVisible(true)}>
              <MaterialIcons name="receipt" size={24} color="black" />
              <View className="flex-1 ml-3">
                <View className="flex-row items-center">
                  {appliedOffer && (
                    <Text className="line-through text-textsecondary">${subtotal.toFixed(2)}</Text>
                  )}
                  <Text className="text-textprimary font-outfit-bold text-lg">${(Number(total) || 0).toFixed(2)} </Text>
                  {appliedOffer && (
                    <View className="bg-green-100 px-2 py-1 rounded ml-2">
                      <Text className="text-green-700 text-xs">You saved ${discount.toFixed(2)}</Text>
                    </View>
                  )}
                </View>
                <Text className="text-textsecondary text-sm">Incl. taxes, charges & donation</Text>
              </View>
              <Entypo name="chevron-right" size={20} color="#aaa" />
            </TouchableOpacity>

            {/* Cancellation Policy */}
            <Text className="text-textprimary font-outfit-bold text-sm mb-2 px-4">CANCELLATION POLICY</Text>
            <Text className="text-textsecondary text-sm px-4 mb-4">
              Help us reduce food waste by avoiding cancellations after placing your order. A 100% cancellation fee will be applied.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-border flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="#333" />
          <View className="ml-2">
            <Text className="text-textsecondary text-xs font-outfit">PAY USING</Text>
            <Text className="text-textprimary font-outfit-bold">Pay on delivery</Text>
            <Text className="text-textsecondary text-xs font-outfit">UPI / Cash</Text>
          </View>
        </View>

        <TouchableOpacity
          className={`px-6 py-3 rounded-lg ${isCartEmpty ? 'bg-border' : 'bg-primary'}`}
          onPress={handlePlaceOrder}
          disabled={isCartEmpty}
        >
          <Text className="text-white font-outfit-bold text-sm">${(Number(total) || 0).toFixed(2)} TOTAL</Text>
          <Text className="text-white font-outfit text-xs">Place Order</Text>
        </TouchableOpacity>
      </View>
      {renderPromoModal()}
      {/* Schedule Delivery Modal */}
      {
        scheduleModalVisible && (
          <Schedule
            onClose={() => setScheduleModalVisible(false)}
            onSave={(selectedTime) => {
              setSelectedScheduleTime(selectedTime);
              setScheduleModalVisible(false);
            }}
          />
        )
      }
      {/* Bill Summary Modal */}
      <Modal
        visible={billModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBillModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 mx-4 w-80 max-h-96">
            {appliedOffer && (
              <>
                <Text className="text-textprimary font-outfit-bold text-lg mb-2">You saved ${discount.toFixed(2)} on this order</Text>
                <Text className="text-textsecondary font-outfit text-sm mb-4">Applied coupon: {appliedOffer.code}</Text>
              </>
            )}
            <Text className="text-textprimary font-outfit-bold text-lg mb-4">Bill Summary</Text>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textsecondary font-outfit text-sm">Item total</Text>
              <Text className="text-textprimary font-outfit text-sm">${(subtotal || 0).toFixed(2)}</Text>
            </View>

            {appliedOffer && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-textsecondary font-outfit text-sm">Discount ({appliedOffer.code})</Text>
                <Text className="text-green-600 font-outfit text-sm">-${discount.toFixed(2)}</Text>
              </View>
            )}

            {!isTiffinOrder && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-textsecondary font-outfit text-sm">Delivery partner fee</Text>
                <Text className="text-textprimary font-outfit text-sm">${deliveryFee.toFixed(2)}</Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textsecondary font-outfit text-sm">GST Charges</Text>
              <Text className="text-textprimary font-outfit text-sm">
                ${typeof gstAmount === 'number' ? gstAmount.toFixed(2) : '0.00'}
              </Text>
            </View>
            {aggregatedOtherTaxesForDisplay.length > 0 &&
              aggregatedOtherTaxesForDisplay.map((tax, index) => (
                <View
                  key={`tax-agg-${index}`}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}
                >
                  <Text style={{ color: '#4b5563' }}>{tax.name}</Text>
                  <Text style={{ color: '#4b5563' }}>${tax.amount?.toFixed(2)}</Text>
                </View>
              ))}
            {carts?.overallOtherCharges > 0 && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                  <TouchableOpacity onPress={() => setShowChargesModal(true)}>
                    <Text style={{ color: '#4b5563' }}>Other Charges</Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#4b5563' }}>${carts.overallOtherCharges.toFixed(2)}</Text>
                </View>

                <Modal
                  visible={showChargesModal}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowChargesModal(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setShowChargesModal(false)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <TouchableWithoutFeedback>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Other Charges Details</Text>
                          {allOtherChargesDetails.map((charge, idx) => (
                            <View key={idx} style={{ marginBottom: 10 }}>
                              <Text>
                                {charge.name}: $
                                {charge.value.toFixed(2) && charge.type === "percentage"
                                  ? `${charge.value.toFixed(2)}%`
                                  : charge.value.toFixed(2)}
                                {charge.type === "percentage" && charge.rate && ` (${parseFloat(charge.rate).toFixed(2)}%)`}
                              </Text>
                            </View>
                          ))}
                          <TouchableOpacity
                            style={{ marginTop: 15, alignSelf: 'flex-end' }}
                            onPress={() => setShowChargesModal(false)}
                          >
                            <Text style={{ color: 'blue' }}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            )}

            {carts?.taxDetails?.map((tax, index) => (
              <View key={`tax-detail-${index}`} className="flex-row justify-between items-center mb-2">
                <Text className="text-textsecondary font-outfit text-sm">
                  {tax.appliedTaxes[0]?.name} (
                  {carts.avgFirmSubcategoryTax === "0.00%"
                    ? "5%"
                    : carts.avgFirmSubcategoryTax}
                  )
                </Text>
                <Text className="text-textprimary font-outfit text-sm">
                  ${tax.gstAmount?.toFixed(2)}
                </Text>
              </View>
            ))}

            <View className="flex-row justify-between items-center mt-4 pt-2 border-t border-border">
              <Text className="text-textprimary font-outfit-bold text-base">Grand Total</Text>
              <Text className="text-textprimary font-outfit-bold text-base">${total.toFixed(2)}</Text>
            </View>

            {appliedOffer && (
              <View className="bg-green-50 p-3 rounded-lg mt-4">
                <Text className="text-green-700 font-outfit text-sm text-center">You saved ${discount.toFixed(2)} on this order</Text>
              </View>
            )}

            <TouchableOpacity
              className="bg-primary p-4 rounded-lg mt-4"
              onPress={() => setBillModalVisible(false)}
            >
              <Text className="text-white font-outfit-bold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

export default TakeAwayCart;  