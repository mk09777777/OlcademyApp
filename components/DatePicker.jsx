import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { Ionicons } from '@expo/vector-icons';

const DatePicker = ({ visible, value, onChange, onClose }) => {
  if (Platform.OS === 'android') {
    return (
      <View className="bg-white rounded-t-2xl p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-base color-gray-500 font-outfit">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-base color-green-500 font-outfit-bold">Done</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
        />
      </View>
    );
  }

  return visible ? (
    <DateTimePicker
      value={value || new Date()}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        if (selectedDate) {
          onChange(selectedDate);
        }
        onClose();
      }}
      minimumDate={new Date()}
      maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
    />
  ) : null;
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  doneButton: {
    padding: 8,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
*/

export default DatePicker; 