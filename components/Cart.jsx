import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';

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
    <View className="mt-2 p-2 bg-gray-50 rounded-lg">
      {item.plan && <Text className="text-xs color-gray-600 font-outfit mb-1">Plan: {item.plan.label}</Text>}
      {item.dates && (
        <Text className="text-xs color-gray-600 font-outfit mb-1">
          Dates: {item.dates.slice(0, 3).join(', ')}
          {item.dates.length > 3 ? ` +${item.dates.length - 3} more` : ''}
        </Text>
      )}
      {item.timeSlots && (
        <Text className="text-xs color-gray-600 font-outfit mb-1">
          Time: {item.timeSlots.join(', ')}
        </Text>
      )}
      {item.addons?.length > 0 && (
        <Text className="text-xs color-gray-600 font-outfit mb-1">
          Add-ons: {item.addons.map(a => a.label).join(', ')}
        </Text>
      )}
      {item.preferences && Object.keys(item.preferences).length > 0 && (
        <Text className="text-xs color-gray-600 font-outfit mb-1">
          Preferences: {Object.entries(item.preferences).map(([key, value]) => `${key}: ${value}`).join(', ')}
        </Text>
      )}
      {item.specialInstructions && (
        <Text className="text-xs color-gray-600 font-outfit">Notes: {item.specialInstructions}</Text>
      )}
    </View>
  );
};

  const renderCartItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm flex-row">
      <Image source={item.image} className="w-16 h-16 rounded-lg" />
      <View className="flex-1 ml-3">
        <Text className="text-base font-outfit-bold color-gray-900">{item.name}</Text>
        {item.description && (
          <Text className="text-sm color-gray-600 font-outfit mt-1">{item.description}</Text>
        )}
        {renderCustomizationDetails(item)}
        <Text className="text-base font-outfit-bold color-primary mt-2">₹{item.price.toFixed(2)}</Text>
      </View>
      <View className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1 ml-2">
        <TouchableOpacity
          className="p-1"
          onPress={() => decrementQuantity(item.id)}
        >
          <Ionicons name="remove" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <Text className="text-base font-outfit-bold mx-3 color-gray-900">{item.quantity}</Text>
        <TouchableOpacity
          className="p-1"
          onPress={() => incrementQuantity(item.id)}
        >
          <Ionicons name="add" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="p-2 ml-2"
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Ionicons name="cart-outline" size={48} color="#666" />
        <Text className="text-lg color-gray-600 font-outfit mt-4 mb-6">Your cart is empty</Text>
        <TouchableOpacity
          className="bg-primary py-3 px-6 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-outfit-bold text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-32"
      />
      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row justify-between mb-2">
          <Text className="text-base color-gray-600 font-outfit">Subtotal</Text>
          <Text className="text-base color-gray-900 font-outfit">₹{getSubtotal().toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base color-gray-600 font-outfit">Discount</Text>
          <Text className="text-base color-gray-900 font-outfit">-₹{getDiscount().toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-4 pt-2 border-t border-gray-200">
          <Text className="text-lg font-outfit-bold color-gray-900">Total</Text>
          <Text className="text-lg font-outfit-bold color-primary">₹{getTotal().toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-primary py-4 mx-4 mb-4 rounded-lg items-center"
        onPress={() => navigation.navigate('Checkout')}
      >
        <Text className="text-white font-outfit-bold text-base">Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;