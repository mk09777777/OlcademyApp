import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; 

export default function Logout({ navigation }) {
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
            Alert.alert(
              "Logout Error",
              "There was a problem during logout. You've been signed out locally.",
              [{ text: "OK" }]
            );
          }
        }
      }
    ]
  );
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Image */}
      <Image
        source={{ uri: 'https://www.grabon.in/indulge/wp-content/uploads/2022/07/Zomato-494x350.png' }}
        style={styles.topImage}
        resizeMode="cover"
      />
      
      <Text style={styles.tagline}>India's #1 Food Delivery and Dining App</Text>
      
      {/* Logout Content */}
      <View style={styles.logoutContainer}>
        <Text style={styles.logoutText}>You're currently logged in</Text>
        
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  topImage: {
    width: '101%',
    height: 230,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    fontWeight: '600',
    color: '#222',
  },
  logoutContainer: {
    width: '85%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#e23744',
    paddingVertical: 14,
    borderRadius: 8,
    width: '101%',
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});