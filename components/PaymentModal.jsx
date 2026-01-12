import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  // StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentModal = ({
  visible,
  onClose,
  amount,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[20px] p-5 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold">Payment Details</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-5">
            <Text className="text-sm text-gray-600">Amount to Pay</Text>
            <Text className="text-[32px] font-bold text-green-500 mt-1">₹{amount}</Text>
          </View>

          <View className="mb-5">
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Card Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View className="flex-row">
              <View className="mb-4 flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-2">Expiry Date</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View className="mb-4 flex-1">
                <Text className="text-sm text-gray-600 mb-2">CVV</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="123"
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Cardholder Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <TouchableOpacity
            className={`p-4 rounded-lg items-center ${loading ? 'bg-green-300' : 'bg-green-500'}`}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <Text className="text-white text-base font-bold">Processing...</Text>
            ) : (
              <Text className="text-white text-base font-bold">Pay ₹{amount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '90%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   amountContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   amountLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   amount: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginTop: 4,
//   },
//   form: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   payButton: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   payButtonDisabled: {
//     backgroundColor: '#a5d6a7',
//   },
//   payButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

export default PaymentModal; 