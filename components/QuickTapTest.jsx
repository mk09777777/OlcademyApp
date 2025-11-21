import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';

const QuickTapTest = () => {
  const handleQuickTap = () => {
    Alert.alert('Success!', 'Quick tap is working perfectly!');
  };

  return (
    <TouchableOpacity 
      onPress={handleQuickTap}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#02757A',
        padding: 15,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
        Test Quick Tap
      </Text>
    </TouchableOpacity>
  );
};

export default QuickTapTest;