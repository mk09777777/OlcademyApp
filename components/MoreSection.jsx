import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Colors from '../components/constants/Colors';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useAuth } from '@/context/AuthContext';

const MoreSection = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout from MoreSection failed:', error);
      Alert.alert('Logout Error', 'Unable to complete logout. Please try again.');
    } finally {
      setIsProcessing(false);
      setModalVisible(false);
    }
  };

  const MoreItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 border-b border-gray-200">
      <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
        <MaterialCommunityIcons name={icon} size={24} color={Colors.textLight} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-outfit color-gray-800">{title}</Text>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={Colors.textLight}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="bg-white mt-2.5">
      <View className="p-4 border-l-4 border-primary">
        <Text className="text-lg font-outfit-semibold color-gray-800">More</Text>
      </View>

      <MoreItem icon="information-outline" title="About" chevron onPress={() => safeNavigation('screens/About')} />
      <MoreItem icon="pencil-outline" title="Send feedback" chevron onPress={() => safeNavigation('screens/SendFeedback')} />
      <MoreItem icon="cog-outline" title="Settings" chevron onPress={() => safeNavigation('/screens/Settings')} />
      <MoreItem icon="chat-outline" title="Frequently asked questions" chevron onPress={() => safeNavigation('screens/FQA')} />
      <MoreItem icon="logout" title="Logout" chevron onPress={() => setModalVisible(true)} />

      {/* Custom Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        className="justify-end m-0"
      >
        <View className="bg-white rounded-t-5 p-5 pb-10">
          <Text className="text-lg font-outfit-bold mb-5 text-center">Ready to log out?</Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="py-4 border-b border-gray-200 items-center"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#d32f2f" />
            ) : (
              <Text className="text-center text-red-600 text-base font-outfit">Log Out</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} className="py-4">
            <Text className="text-center text-gray-600 text-base font-outfit">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MoreSection;

