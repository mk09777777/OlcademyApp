import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { MaterialIcons } from '@expo/vector-icons';

const OrderSuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { orderId, totalAmount, restaurantName, autoRedirect } = params;

  useEffect(() => {
    if (autoRedirect === 'true') {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [autoRedirect, router]);

  const handleOkClick = () => {
    router.replace('/home');
  };

  return (
    <MotiView
      className="flex-1 bg-white justify-center items-center p-5"
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 10,
          delay: 300,
        }}
      >
        <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
      </MotiView>

      <MotiText
        className="text-2xl font-outfit-bold text-textprimary mt-4 mb-2"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 600 }}
      >
        Order Placed Successfully!
      </MotiText>

      <MotiText
        className="text-base text-textsecondary mb-4 text-center font-outfit"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 800 }}
      >
        Thank you for your order at {restaurantName || 'the restaurant'}.
      </MotiText>

      <MotiText
        className="text-sm text-textsecondary mb-2 font-outfit"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 1010 }}
      >
        {/* Order ID: {orderId || 'N/A'} */}
      </MotiText>

      <MotiText
        className="text-sm text-textsecondary mb-2 font-outfit"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 1200 }}
      >
        Total Amount: ₹{totalAmount || '0.00'}
      </MotiText>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 300, delay: 1800 }}
      >
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full mt-8 shadow-sm" onPress={handleOkClick}>
          <Text className="text-white font-outfit-bold text-base">OK</Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );
};



export default OrderSuccess;