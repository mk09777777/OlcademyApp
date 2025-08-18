import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
      style={styles.header}
      activeOpacity={0.7}
    >
      {user?.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>{profileInitial}</Text>
        </View>
      )}
      <Text style={styles.username}>{user?.username || 'User'}</Text>
      <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    width: '100%',
  },
  profileCircle: {
       width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#E8F0FE',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: -85,
      borderWidth: 3,
      borderColor: '#fff',
      elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: Colors.text,
  },
  email: {
    color: Colors.textLight,
    marginTop: 4,
    fontSize: 14,
  },
  viewProfile: {
    color: Colors.primary,
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});