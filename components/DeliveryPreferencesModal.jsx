import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DeliveryPreferencesModal = ({
  visible,
  onClose,
  currentPreferences = {
    deliveryTime: '',
    deliveryAddress: '',
    deliveryInstructions: ''
  },
  onSave,
  timeSlots = []
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(currentPreferences?.deliveryTime || '');
  const [address, setAddress] = useState(currentPreferences?.deliveryAddress || '');
  const [instructions, setInstructions] = useState(currentPreferences?.deliveryInstructions || '');

  const handleSave = () => {
    if (!selectedTimeSlot || !address.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSave({
      deliveryTime: selectedTimeSlot,
      deliveryAddress: address.trim(),
      deliveryInstructions: instructions.trim(),
    });
    onClose();
  };

  const renderTimeSlot = (time) => {
    const isSelected = selectedTimeSlot === time;
    return (
      <TouchableOpacity
        key={time}
        className={`flex-row items-center justify-between p-4 rounded-lg ${
          isSelected ? 'bg-green-50 border border-green-500' : 'bg-gray-100'
        }`}
        onPress={() => setSelectedTimeSlot(time)}
      >
        <Text className={`text-base font-outfit ${
          isSelected ? 'color-green-600 font-outfit-bold' : 'color-gray-700'
        }`}>
          {time}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
            <Text className="text-xl font-outfit-bold color-gray-700">Update Delivery Preferences</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <View className="p-5 border-b border-gray-100">
              <Text className="text-lg font-outfit-bold color-gray-700 mb-2">Delivery Time</Text>
              <Text className="text-sm color-gray-500 font-outfit mb-4">
                Select your preferred delivery time
              </Text>
              <View className="gap-3">
                {timeSlots.map(renderTimeSlot)}
              </View>
            </View>

            <View className="p-5 border-b border-gray-100">
              <Text className="text-lg font-outfit-bold color-gray-700 mb-2">Delivery Address</Text>
              <Text className="text-sm color-gray-500 font-outfit mb-4">
                Enter your complete delivery address
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-3 text-base font-outfit min-h-[100px]"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your delivery address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View className="p-5 border-b border-gray-100">
              <Text className="text-lg font-outfit-bold color-gray-700 mb-2">Delivery Instructions</Text>
              <Text className="text-sm color-gray-500 font-outfit mb-4">
                Add any special instructions for delivery (optional)
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-3 text-base font-outfit min-h-[80px]"
                value={instructions}
                onChangeText={setInstructions}
                placeholder="e.g., Please ring the doorbell"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View className="flex-row p-5 border-t border-gray-100 gap-3">
            <TouchableOpacity
              className="flex-1 p-4 rounded-lg bg-gray-100 items-center"
              onPress={onClose}
            >
              <Text className="text-base font-outfit-bold color-gray-500">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 p-4 rounded-lg bg-green-500 items-center"
              onPress={handleSave}
            >
              <Text className="text-base font-outfit-bold text-white">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  timeSlotsContainer: {
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addressInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  instructionsInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
*/

export default DeliveryPreferencesModal; 