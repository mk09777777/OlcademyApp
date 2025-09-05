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
import { styles } from '@/styles/TakeAwayCartStyles';
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
      const response = await fetch('http://10.34.125.16:3000/api/getnotifications', {
        method: 'GET',
        credentials: 'include',
      });
      const settings = await response.json();

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
    <View style={styles.restaurantHeader}>
      {section.image && (
        <Image
          source={{ uri: section.image }}
          style={styles.restaurantImage}
        />
      )}
      <View style={styles.restaurantHeaderText}>
        <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
          {section.name}
        </Text>
        <Text style={styles.restaurantAddress} numberOfLines={2} ellipsizeMode="tail">
          {section.address}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemPrice}>Item Price:-  ${(item.price || 0).toFixed(2)}</Text>
        <Text style={styles.itemPrices}>Total Item Price:-  ${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.productId || item._id || item.id, -1)}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.productId || item._id || item.id, 1)}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemove(item.productId || item._id || item.id)}
          style={styles.deleteButton}
        >
          <MaterialIcons name='delete-outline' size={24} color={'red'} />
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
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { padding: 20, maxHeight: '80%' }]}>
          <Text style={[styles.modalTitle, { marginBottom: 20 }]}>Promotions</Text>

          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <TextInput
              placeholder="Enter promo code"
              value={manualPromoCode}
              onChangeText={setManualPromoCode}
              style={[styles.input, { flex: 1, marginRight: 10 }]}
            />
            <TouchableOpacity
              style={[styles.confirmButton, { paddingHorizontal: 20 }]}
              onPress={handleManualCodeApply}
            >
              <Text style={styles.confirmButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <View key={`${offer._id}-${offer.source}`} style={styles.promoCard}>
                  <Text style={styles.promoName}>{offer.name || `Offer ${offer.code}`}</Text>
                  {offer.code && <Text style={styles.promoCode}>Code: {offer.code}</Text>}
                  <Text style={styles.promoDiscount}>
                    Discount: {offer.offerType === "percentage"
                      ? `${offer.discountValue}%`
                      : `$${offer.discountValue.toFixed(2)}`}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={styles.promoDate}>
                      Valid until: {formatPromoDate(offer.endDate)}
                    </Text>
                    <TouchableOpacity
                      style={styles.promoApplyButton}
                      onPress={() => handleApplyOffer(offer)}
                    >
                      <Text style={styles.promoApplyButtonText}>Apply</Text>
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
            style={[styles.closeButton, { marginTop: 20 }]}
            onPress={() => setIsPromoOpen(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
         <Text style={styles.title}>Your Cart</Text>
        <View style={styles.cartSummary}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Image
                style={styles.emptyCartImage}
                source={require('@/assets/images/empty_cart.png')}
              />
              <Text style={styles.emptyCartText}>Your cart is empty!</Text>
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
     <View style={styles.promotionContainer}>
            <Text style={styles.sectionTitle}>Promotion</Text>
            {!appliedOffer ? (
              <TouchableOpacity
                style={styles.addPromoButton}
                onPress={() => setIsPromoOpen(true)}
              >
                <Text style={styles.addPromoButtonText}>Add promo code</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.appliedPromoContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.emoji}>🎉</Text>
                  <Text style={styles.appliedPromoText}>
                    You saved ${discount.toFixed(2)} with '{appliedOffer.code || appliedOffer.name}'
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setAppliedOffer(null)}
                  style={styles.removePromoButton}
                >
                  <Text style={styles.removePromoButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {appliedOffer && (
              <TouchableOpacity
                style={styles.viewAllCouponsButton}
                onPress={() => setIsPromoOpen(true)}
              >
                <Text style={styles.viewAllCouponsText}>View all coupons</Text>
              </TouchableOpacity>
            )}
          </View>
        <View style={styles.card}>
     

          {/* Tiffin-specific fields */}
          {isTiffinOrder && (
               <View>
            <View >
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
                  <Text style={{ fontFamily: 'outfit-bold', fontSize: 16, color: '#2b6cb0' }}>
                    Delivery Time: {cartItems[0]?.selectedDeliveryTimeSlot}
                  </Text>
                </View>
              ) : (
                <Text style={{
                  color: '#718096',
                  textAlign: 'center',
                  paddingVertical: 10,
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
            <View style={styles.pickup}>
              <Text style={styles.modalTitle}>Delivery Details</Text>
              <View style={styles.phone}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={countryCode}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCountryCode(itemValue)}
                  >
                    <Picker.Item label="+91" value="+91" />
                    <Picker.Item label="USA (+1)" value="+1" />
                    <Picker.Item label="UK (+44)" value="+44" />
                  </Picker>
                </View>
                <TextInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  style={styles.phoneinput}
                />
              </View>

              <TouchableOpacity
                onPress={() => router.push('/screens/DeliveryAddress')}
                style={styles.addressInputContainer}
              >
                <TextInput
                  placeholder="Delivery Address"
                  value={pickupAddress}
                  onChangeText={setPickupAddress}
                  multiline
                  style={[styles.input,]}
                  editable={false}
                />
              </TouchableOpacity>

              <TextInput
                placeholder="Special Instructions"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                style={[styles.input]}
              />
            </View>
          </View>
          )}

          {/* Restaurant pickup details */}
          {!isTiffinOrder && (

            <View style={styles.container}>
              {/* Delivery/Pickup Time Section */}
              <Pressable onPress={() => setScheduleModalVisible(true)}>
                <View style={styles.row}>
                  <Feather name="clock" size={20} color="#333" />
                  <View style={styles.info}>
                    <Text style={styles.locationTitle}>Pickup Time</Text>
                    <Text style={styles.locationAddress}>
                      Standard (Approx. 30 Mins)
                    </Text>
                    <Text style={styles.locationSubAddress}>
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

                    {/* <Text style={styles.link}>Want this later? Schedule it</Text> */}
                  </View>
                  <Entypo name="chevron-right" size={20} color="#aaa" />
                </View>
              </Pressable>

              {/* Location Section */}
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={18} color="#333" style={styles.icon} />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationTitle}>Pickup Location</Text>
                  <Text style={styles.locationAddress}>
                    {taxDetails[0]?.name || 'Restaurant Name'}
                  </Text>
                  <Text style={styles.locationSubAddress}>
                    {taxDetails[0]?.address || '123 Main St, City, State'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Total Bill */}
          <TouchableOpacity style={styles.row} onPress={() => setBillModalVisible(true)}>
            <MaterialCommunityIcons name="receipt" size={18} color="#333" />
            <View style={styles.info}>
              <View style={styles.billRow}>
                {appliedOffer && (
                  <Text style={styles.striked}>${subtotal.toFixed(2)}</Text>
                )}
                <Text style={styles.boldPrice}>${(Number(total) || 0).toFixed(2)} </Text>
                {appliedOffer && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>You saved ${discount.toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.subLabel}>Incl. taxes, charges & donation</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Cancellation Policy */}
        <Text style={styles.cancelTitle}>CANCELLATION POLICY</Text>
        <Text style={styles.cancelText}>
          Help us reduce food waste by avoiding cancellations after placing your order. A 100% cancellation fee will be applied.
        </Text>
      </ScrollView >

      {/* Bottom Bar */}
      < View style={styles.footer} >
        <View style={styles.paymentMethod}>
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="#333" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.payUsing}>PAY USING</Text>
            <Text style={styles.payMethod}>Pay on delivery</Text>
            <Text style={styles.subLabel}>UPI / Cash</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, isCartEmpty && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isCartEmpty}
        >
          <Text style={styles.totalText}>${(Number(total) || 0).toFixed(2)} TOTAL</Text>
          <Text style={styles.placeText}>Place Order</Text>
        </TouchableOpacity>
      </View >
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 20 }]}>
            {appliedOffer && (
              <>
                <Text style={styles.modalTitle}>You saved ${discount.toFixed(2)} on this order</Text>
                <Text style={styles.modalSub}>Applied coupon: {appliedOffer.code}</Text>
              </>
            )}
            <Text style={styles.billSummaryTitle}>Bill Summary</Text>

            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Item total</Text>
              <Text style={styles.billValue}>${(subtotal || 0).toFixed(2)}</Text>
            </View>

            {appliedOffer && (
              <View style={styles.billRowItem}>
                <Text style={styles.billLabel}>Discount ({appliedOffer.code})</Text>
                <Text style={[styles.billValue, { color: 'green' }]}>-${discount.toFixed(2)}</Text>
              </View>
            )}

            {!isTiffinOrder && (
              <View style={styles.billRowItem}>
                <Text style={styles.billLabel}>Delivery partner fee</Text>
                <Text style={styles.billValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
            )}

            {/* <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Platform fee</Text>
              <Text style={styles.billValue}>${platformFee.toFixed(2)}</Text>
            </View> */}

            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>GST Charges</Text>
              <Text style={styles.billValue}>
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
              <View key={`tax-detail-${index}`} style={styles.taxDetailRow}>
                <Text style={styles.billLabel}>
                  {tax.appliedTaxes[0]?.name} (
                  {carts.avgFirmSubcategoryTax === "0.00%"
                    ? "5%"
                    : carts.avgFirmSubcategoryTax}
                  )
                </Text>
                <Text style={styles.billValue}>
                  ${tax.gstAmount?.toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={[styles.billRowItem, { marginTop: 10 }]}>
              <Text style={[styles.billLabel, { fontWeight: 'bold' }]}>Grand Total</Text>
              <Text style={[styles.billValue, { fontWeight: 'bold' }]}>${total.toFixed(2)}</Text>
            </View>

            {appliedOffer && (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>You saved ${discount.toFixed(2)} on this order</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBillModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

export default TakeAwayCart;  