import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TiffinOrderCard = ({ booking, onPress }) => {
  const getStatusColor = (status) => ({
    active: '#08a742',
    pending: '#f57c00',
    completed: '#2196f3',
    cancelled: '#e53935'
  })[status] || '#757575';

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return 'checkmark-circle';
      case 'pending': return 'time-outline';
      case 'completed': return 'flag-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const options = { day: 'numeric', month: 'short' };
    
    if (!endDate) return start.toLocaleDateString('en-IN', options);
    
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}`;
  };

  return (
    <TouchableOpacity className="bg-white rounded-3xl p-4 mb-4 shadow-md" onPress={onPress}>
      <View className="mb-3.5">
        <View className="flex-row justify-between items-center mb-2">
          <View className={`px-2.5 py-1 rounded-full self-start ${
            booking.type === 'One Day' ? 'bg-blue-50' : 
            booking.type === 'Weekly' ? 'bg-green-50' : 'bg-orange-50'
          }`}>
            <Text className="text-xs font-semibold text-textsecondary">{booking.type}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons 
              name={getStatusIcon(booking.status)} 
              size={16} 
              color={getStatusColor(booking.status)}
              className="mr-1"
            />
            <Text className="text-xs font-medium" style={{ color: getStatusColor(booking.status) }}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-textsecondary">
          {formatDateRange(booking.startDate, booking.endDate)}
        </Text>
      </View>

      <View className="mb-3.5">
        <View className="flex-row items-center mb-2">
          <Ionicons name="restaurant-outline" size={20} color="#757575" />
          <Text className="ml-2 text-sm text-textsecondary">{booking.menu}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#757575" />
          <Text className="ml-2 text-sm text-textsecondary">{booking.meals.join(' & ')}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-textsecondary">Total</Text>
          <Text className="text-base font-bold text-textprimary">₹{booking.price.totalAmount}</Text>
        </View>
        
        {booking.status === 'active' && (
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-2xl">
            <Text className="text-white font-semibold text-sm">Track Today's Meal</Text>
          </TouchableOpacity>
        )}
        
        {booking.status === 'pending' && (
          <TouchableOpacity className="bg-white border border-orange-500 px-4 py-2 rounded-2xl">
            <Text className="text-orange-500 font-semibold text-sm">Pay Now</Text>
          </TouchableOpacity>
        )}
        
        {booking.status === 'completed' && (
          <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-2xl">
            <Text className="text-gray-600 font-semibold text-sm">Renew Plan</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};


  export default TiffinOrderCard;