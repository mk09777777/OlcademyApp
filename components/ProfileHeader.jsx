import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Colors from '../components/constants/Colors';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function ProfileHeader() {
  const { user } = useAuth(); 
 const { safeNavigation } = useSafeNavigation();
  const handlePress = () => {
    safeNavigation('/screens/ProfileScreen');
  };
  const profileInitial = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      className="pt-0 pb-3 px-0 items-center"
      activeOpacity={0.7}
    >
      {user?.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          className="w-20 h-20 rounded-full mb-2.5"
        />
      ) : (
        <View className="w-20  h-20 rounded-full bg-blue-50 justify-center items-center border-2 border-white shadow-md">
          <Text className="text-3xl text-primary font-bold">{profileInitial}</Text>
        </View>
      )}
      <Text className="text-xl font-bold mt-1 text-textprimary">{user?.username || 'User'}</Text>
      <Text className="text-textsecondary mt-1 text-sm">{user?.email || 'user@example.com'}</Text>
    </TouchableOpacity>
  );
}