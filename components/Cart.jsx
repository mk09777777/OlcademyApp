import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Cart';

const Cart = () => {
  const navigation = useNavigation();
  const {
    getCartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getSubtotal,
    getDiscount,
    getTotal,
    clearCart
  } = useCart();

  const cartItems = getCartItems();
const renderCustomizationDetails = (item) => {
  if (!item.customization) return null;
  
  return (
    <View style={styles.customizationDetails}>
      {item.plan && <Text style={styles.customizationLabel}>Plan: {item.plan.label}</Text>}
      {item.dates && (
        <Text style={styles.customizationLabel}>
          Dates: {item.dates.slice(0, 3).join(', ')}
          {item.dates.length > 3 ? ` +${item.dates.length - 3} more` : ''}
        </Text>
      )}
      {item.timeSlots && (
        <Text style={styles.customizationLabel}>
          Time: {item.timeSlots.join(', ')}
        </Text>
      )}
      {item.addons?.length > 0 && (
        <Text style={styles.customizationLabel}>
          Add-ons: {item.addons.map(a => a.label).join(', ')}
        </Text>
      )}
      {item.preferences && Object.keys(item.preferences).length > 0 && (
        <Text style={styles.customizationLabel}>
          Preferences: {Object.entries(item.preferences).map(([key, value]) => `${key}: ${value}`).join(', ')}
        </Text>
      )}
      {item.specialInstructions && (
        <Text style={styles.customizationLabel}>Notes: {item.specialInstructions}</Text>
      )}
    </View>
  );
};

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
        {renderCustomizationDetails(item)}
        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decrementQuantity(item.id)}
        >
          <Ionicons name="remove" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => incrementQuantity(item.id)}
        >
          <Ionicons name="add" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Ionicons name="cart-outline" size={48} color="#666" />
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.continueShoppingText}>Continue </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{getSubtotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>-₹{getDiscount().toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{getTotal().toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate('Checkout')}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;