import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      style={styles.container}
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
        style={styles.title}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 600 }}
      >
        Order Placed Successfully!
      </MotiText>

      <MotiText
        style={styles.subtitle}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 800 }}
      >
        Thank you for your order at {restaurantName || 'the restaurant'}.
      </MotiText>

      <MotiText
        style={styles.orderDetails}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 1010 }}
      >
        {/* Order ID: {orderId || 'N/A'} */}
      </MotiText>

      <MotiText
        style={styles.orderDetails}
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
        <TouchableOpacity style={styles.button} onPress={handleOkClick}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 32,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderSuccess;