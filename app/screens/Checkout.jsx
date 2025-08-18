import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/Checkoutstyle';

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isCartEmpty ? (
          <View style={styles.emptyCartContainer}>
            <Image 
              style={styles.emptyCartImage} 
              source={require('../../assets/images/empty_cart.png')}
            />
            <Text style={styles.emptyCartText}>Your cart is empty!</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <View style={styles.itemInfo}>
                    {item.image && (
                      <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemPrice}>₹{Number(item.price || 0).toFixed(2)}</Text>
                      {item.customization && (
                        <Text style={styles.customizedText}>Customized</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.controls}>
                    <TouchableOpacity 
                      onPress={() => decrementQuantity(item.id)}
                      style={styles.controlButton}
                      disabled={item.quantity <= 1}
                    >
                      <Text style={[styles.controlButtonText, item.quantity <= 1 && styles.disabledControl]}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      onPress={() => incrementQuantity(item.id)}
                      style={styles.controlButton}
                    >
                      <Text style={styles.controlButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      style={styles.deleteButton}
                    >
                      <MaterialIcons name='delete-outline' size={24} color={'red'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View style={styles.billDetails}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Discount</Text>
                  <Text style={[styles.billValue, styles.discountValue]}>-₹{discount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Platform Fee</Text>
                <Text style={styles.billValue}>₹{platformFee.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>GST & Charges (5%)</Text>
                <Text style={styles.billValue}>₹{calculateGST().toFixed(2)}</Text>
              </View>
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={[styles.billLabel, styles.totalLabel]}>Total</Text>
                <Text style={[styles.billValue, styles.totalValue]}>
                  ₹{calculateFinalTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {!isCartEmpty && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              (!state.deliveryAddress || state.isLoading) && styles.disabledButton,
            ]}
            onPress={handlePlaceOrder}
            disabled={!state.deliveryAddress || state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.checkoutButtonText}>Place Order</Text>
                <Text style={styles.checkoutButtonPrice}>₹{calculateFinalTotal().toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;