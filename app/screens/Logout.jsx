import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import BackRouting from '@/components/BackRouting';

export default function Logout() {
  const { logout } = useAuth(); 

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed, clearing locally', error);
              Alert.alert(
                "Logout Error",
                "There was a problem during logout. You&apos;ve been signed out locally.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting title='Logout' />
      <ScrollView className="flex-1 items-center justify-center pb-10 bg-white">
      {/* Header Image */}
      <Image
        source={{ uri: 'https://www.grabon.in/indulge/wp-content/uploads/2022/07/Zomato-494x350.png' }}
        className="w-full h-58"
        resizeMode="cover"
      />
      
  <Text className="text-base text-center mt-2 mb-8 font-outfit-bold text-textprimary">India&apos;s #1 Food Delivery and Dining App</Text>
      
      {/* Logout Content */}
      <View className="w-4/5 items-center p-5 rounded-lg bg-light shadow-sm">
  <Text className="text-base mb-5 text-textsecondary text-center font-outfit">You&apos;re currently logged in</Text>
        
        <TouchableOpacity 
          className="bg-primary py-4 rounded-lg w-full"
          onPress={handleLogout}
        >
          <Text className="text-white text-base text-center font-outfit-bold">Log Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

