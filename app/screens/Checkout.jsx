import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const {
    getCartItems,
    getSubtotal,
    getDiscount,
    getTotal,
    clearCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const [state, setState] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'cash',
    isLoading: false
  });

  const cartItems = getCartItems();
  const subtotal = Number(getSubtotal?.() || 0);
  const discount = Number(getDiscount?.() || 0);
  const total = Number(getTotal?.() || 0);
  const params = useLocalSearchParams();
  const { addToCart } = useCart();

  // Fees and charges
  const [deliveryFee] = useState(35);
  const [platformFee] = useState(10);
  const [gstRate] = useState(0.05); // 5% GST

  const calculateGST = () => {
    return subtotal * gstRate;
  };

  const calculateFinalTotal = () => {
    return subtotal + deliveryFee + platformFee + calculateGST() - discount;
  };

  useEffect(() => {
    if (params?.orderDetails) {
      try {
        const orderDetails = JSON.parse(params.orderDetails);
        if (typeof orderDetails.price === 'string') {
          orderDetails.price = parseFloat(orderDetails.price.replace(/[^0-9.-]+/g, ""));
        }
        addToCart(orderDetails);
        router.setParams({ orderDetails: undefined });
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, [params?.orderDetails]);

  const handlePlaceOrder = async () => {
    if (!state.deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderDetails = {
        items: cartItems,
        deliveryAddress: state.deliveryAddress,
        specialInstructions: state.specialInstructions,
        paymentMethod: state.paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        platformFee,
        gst: calculateGST(),
        total: calculateFinalTotal(),
        orderDate: new Date().toISOString()
      };
      
      clearCart();
      navigation.navigate('OrderConfirmation', orderDetails);
    } catch (error) {
      console.error('Order placement error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4">
      <Text className="text-2xl font-bold my-5 text-center text-gray-800">Checkout</Text>
      
      <ScrollView className="pb-5">
        {isCartEmpty ? (
          <View className="flex-1 justify-center items-center mt-25">
            <Image 
              className="w-50 h-50 mb-5" 
              source={require('../../assets/images/empty_cart.png')}
            />
            <Text className="text-lg text-gray-600">Your cart is empty!</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-white rounded-lg p-3 mb-2.5 shadow-sm">
                  <View className="flex-row items-center mb-2.5">
                    {item.image && (
                      <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        className="w-15 h-15 rounded-lg mr-3"
                        resizeMode="cover"
                      />
                    )}
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                      <Text className="text-sm text-gray-600 mt-1">₹{Number(item.price || 0).toFixed(2)}</Text>
                      {item.customization && (
                        <Text className="text-xs text-green-500 mt-1">Customized</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity 
                      onPress={() => decrementQuantity(item.id)}
                      className="w-7.5 h-7.5 rounded-full bg-gray-100 justify-center items-center"
                      disabled={item.quantity <= 1}
                    >
                      <Text className={`text-lg text-gray-800 ${item.quantity <= 1 ? 'text-gray-300' : ''}`}>-</Text>
                    </TouchableOpacity>
                    <Text className="text-base font-medium mx-2.5 text-gray-800">{item.quantity}</Text>
                    <TouchableOpacity 
                      onPress={() => incrementQuantity(item.id)}
                      className="w-7.5 h-7.5 rounded-full bg-gray-100 justify-center items-center"
                    >
                      <Text className="text-lg text-gray-800">+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      className="p-1.25"
                    >
                      <MaterialIcons name='delete-outline' size={24} color={'red'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View className="bg-white rounded-lg p-4 mt-2.5 shadow-sm">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Subtotal</Text>
                <Text className="text-sm text-gray-800">₹{subtotal.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Discount</Text>
                  <Text className="text-sm text-green-500">-₹{discount.toFixed(2)}</Text>
                </View>
              )}
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Delivery Fee</Text>
                <Text className="text-sm text-gray-800">₹{deliveryFee.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Platform Fee</Text>
                <Text className="text-sm text-gray-800">₹{platformFee.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">GST & Charges (5%)</Text>
                <Text className="text-sm text-gray-800">₹{calculateGST().toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-200 pt-2.5 mt-1.25">
                <Text className="text-base font-bold text-gray-800">Total</Text>
                <Text className="text-base font-bold text-gray-800">
                  ₹{calculateFinalTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {!isCartEmpty && (
        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            className={`rounded-lg p-4 flex-row justify-between items-center ${
              (!state.deliveryAddress || state.isLoading) ? 'bg-green-300' : 'bg-green-500'
            }`}
            onPress={handlePlaceOrder}
            disabled={!state.deliveryAddress || state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white text-base font-bold">Place Order</Text>
                <Text className="text-white text-base font-bold">₹{calculateFinalTotal().toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;

/* Original Checkoutstyle Reference:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 16 },
  title: { fontSize: 24, fontFamily: 'outfit-bold', fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#333' },
  contentContainer: { paddingBottom: 20 },
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyCartImage: { width: 200, height: 200, marginBottom: 20 },
  emptyCartText: { fontSize: 18, fontFamily: 'outfit-medium', color: '#666' },
  itemContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  itemInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemTextContainer: { flex: 1 },
  itemText: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: '500', color: '#333' },
  itemPrice: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666', marginTop: 4 },
  customizedText: { fontSize: 12, fontFamily: 'outfit', color: '#4CAF50', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  controlButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  controlButtonText: { fontSize: 18, fontFamily: 'outfit-medium', color: '#333' },
  disabledControl: { color: '#ccc' },
  quantityText: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: '500', marginHorizontal: 10, color: '#333' },
  deleteButton: { padding: 5 },
  billDetails: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 14, fontFamily: 'outfit', color: '#666' },
  billValue: { fontSize: 14, fontFamily: 'outfit', color: '#333' },
  discountValue: { color: '#4CAF50' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  totalLabel: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 16, fontFamily: 'outfit-medium', fontWeight: 'bold', color: '#333' },
  buttonContainer: { padding: 16, fontFamily: 'outfit-medium', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  checkoutButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontFamily: 'outfit-medium', fontWeight: 'bold' },
  checkoutButtonPrice: { color: '#fff', fontSize: 16, fontFamily: 'outfit-medium', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#a5d6a7' }
});
*/