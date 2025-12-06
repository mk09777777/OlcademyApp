import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { useSafeNavigation } from '@/hooks/navigationPage';

const TableSection = () => {
  const { safeNavigation } = useSafeNavigation();

  const TableItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 border-b border-gray-200">
      <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={Colors.textLight}
        />
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
        <Text className="text-lg font-outfit-semibold color-gray-800">Dining</Text>
      </View>

      <TableItem
        icon="seat"
        title="Your booking"
        chevron
        onPress={() => safeNavigation('/screens/OrderSupportChat')}
      />
      <TableItem
        icon="file-document-outline"
        title="Your dining transactions"
        chevron
        onPress={() => safeNavigation('/screens/DiningTransactions')}
      />
      <TableItem
        icon="chat-outline"
        title="Dining booking help"
        chevron
        onPress={() => safeNavigation('/screens/DiningBookingHelp')}
      />
    </View>
  );
};

export default TableSection;
