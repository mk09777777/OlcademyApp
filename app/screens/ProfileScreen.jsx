import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../components/constants/Colors';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import BackRouting from "@/components/BackRouting";
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

const ProfileScreen = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
  const [userData, setUserData] = useState()
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  const [localProfile, setLocalProfile] = useState({
    name: '',
    email: '',
    profileImage: null,
    dob: new Date(),
    anniversary: new Date(),
    gender: 'Male',
    mobile: ''
  });
  const profileInitial = user?.username?.charAt(0).toUpperCase() || 'U';
  useEffect(() => {
    if (user) {
      setLocalProfile({
        name: user.username || user.displayName || '',
        email: user.email || '',
        profileImage: user.profilePic || null,
        dob: user.dob ? new Date(user.dob) : new Date(),
        anniversary: user.anniversary ? new Date(user.anniversary) : new Date(),
        gender: user.gender || 'Male',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const handleGetUserData = async () => {
    try {

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/user/profileData`, {
        withCredentials: true
      })
      const data = response.data
      setUserData(data)
      console.log("data fetched is", data)

    } catch (error) {
      console.error("error in getting user Data", error);
    }
  }

  useEffect(() => {
    handleGetUserData()
  }, [])

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (fieldToUpdate === 'dob' ? localProfile.dob : localProfile.anniversary);

    if (fieldToUpdate === 'dob') {
      setShowDobPicker(false);
      handleChange('dob', currentDate);
    } else {
      setShowAnniversaryPicker(false);
      handleChange('anniversary', currentDate);
    }
  };

  // http://192.168.0.106:3000/user/profileEdit

  const handleUpdateBackend = async () => {
    const uploadData = {
      username: localProfile.name,
      // email: localProfile.email,
      dateOfBirth: localProfile.dob.toISOString(),
      anniversary: localProfile.anniversary.toISOString(),
      gender: localProfile.gender,

    }
    try {
      await axios.post(`${API_CONFIG.BACKEND_URL}/user/profileEdit`,
        uploadData
        ,
        {
          withCredentials: true
        })
      console.log("data uploaded to server", uploadData)
    }
    catch (error) {
      console.log("error in uploading the user data", error);
    }
  }

  const handleUpdate = async () => {
    if (isEditing) {
      const updatedProfile = {
        ...user,
        displayName: localProfile.name,
        username: localProfile.name,
        email: localProfile.email,
        profilePicture: localProfile.profileImage,
        dob: localProfile.dob.toISOString(),
        anniversary: localProfile.anniversary.toISOString(),
        gender: localProfile.gender,
        mobile: localProfile.mobile
      };

      try {
        await handleUpdateBackend();

        await AsyncStorage.setItem('userData', JSON.stringify(updatedProfile));
        console.log('Profile updated locally:', updatedProfile);

        // ✅ Re-fetch the updated data from server
        await handleGetUserData();

      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }

    setIsEditing(!isEditing);
  };



  return (
    <View className="flex-1 bg-background">
          <BackRouting  />  
      {/* Header with Profile Image */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 20 }}>
        <View className="items-center p-5 mt-2.5">
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              className="w-30 h-30 rounded-full mb-2.5"
            />
          ) : (
            <View className="w-30 h-30 rounded-full bg-light justify-center items-center border-2 border-white shadow-md">
              <Text className="text-3xl text-primary font-outfit-bold">{profileInitial}</Text>
            </View>
          )}
        </View>


        {/* Name Field */}
        <View className="p-5 flex-col justify-start mx-2.5 bg-white rounded-lg shadow-sm">
          <View className="flex-row justify-start items-center mt-2.5">
            <AntDesign name="user" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-outfit ml-2 mt-2.5">Name</Text>
          </View>
          <View className="mb-1 mx-2.5 p-2 rounded-lg border border-border flex-row justify-between items-center mt-1">
            {isEditing ? (
              <TextInput
                className="text-base text-textprimary py-1 flex-1 font-outfit"
                value={localProfile.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            ) : (
              <Text className="text-base text-textprimary font-outfit">{localProfile.name || 'Not set'}</Text>
            )}
          </View>

          {/* Email Field */}
          <View className="flex-row justify-start items-center mt-2.5">
            <Fontisto name="email" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-outfit ml-2 mt-2.5">Email</Text>
          </View>
          <View className="mb-1 mx-2.5 p-2 rounded-lg border border-border flex-row justify-between items-center mt-1">
            <View className="flex-row items-center flex-1">
                <Text className="text-base text-textprimary font-outfit">{localProfile.email || 'Not set'}</Text>
            </View>
          </View>

          {/* Mobile Field */}
          <View className="flex-row justify-start items-center mt-2.5">
            <Ionicons name="call-outline" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-normal ml-2 mt-2.5">Mobile</Text>
          </View>
          <View className="mb-1 mx-2.5 p-2 rounded-2xl border border-border flex-row justify-between items-center mt-1">
            <View className="flex-row items-center flex-1">
              {isEditing ? (
                <TextInput
                  className="text-base text-textprimary py-1 flex-1"
                  value={localProfile.mobile}
                  onChangeText={(text) => handleChange('mobile', text)}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-base text-textprimary font-normal">{localProfile.mobile || 'Not set'}</Text>
              )}
            </View>
            {isEditing && (
              <TouchableOpacity onPress={() => handleChange('mobile', '')}>
                <Text className="text-blue-500 text-sm font-medium ml-2">CLEAR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date of Birth Field */}
          <View className="flex-row justify-start items-center mt-2.5">
            <Fontisto name="date" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-normal ml-2 mt-2.5">Date of birth</Text>
          </View>
          <View className="mb-1 mx-2.5 p-2 rounded-2xl border border-border flex-row justify-between items-center mt-1">
            {isEditing ? (
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  setFieldToUpdate('dob');
                  setShowDobPicker(true);
                }}
              >
                <Text className="text-base text-textprimary font-normal">{formatDate(localProfile.dob)}</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-base text-textprimary font-normal">{formatDate(localProfile.dob)}</Text>
            )}
            {showDobPicker && (
              <DateTimePicker
                value={localProfile.dob}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Anniversary Field */}
          <View className="flex-row justify-start items-center mt-2.5">
            <Fontisto name="date" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-normal ml-2 mt-2.5">Anniversary</Text>
          </View>
          <View className="mb-1 mx-2.5 p-2 rounded-2xl border border-border flex-row justify-between items-center mt-1">
            <Text className="text-base text-textprimary font-normal">{formatDate(localProfile.anniversary)}</Text>
            {showAnniversaryPicker && (
              <DateTimePicker
                value={localProfile.anniversary}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Gender Field */}
          <View className="flex-row justify-start items-center mt-2.5">
            <AntDesign name="user" size={18} color="#02757A" className="ml-2.5 mt-1" />
            <Text className="text-sm text-textsecondary mb-1 font-normal ml-2 mt-2.5">Gender</Text>
          </View>
          {isEditing ? (
            <View className="flex-row justify-between mx-2.5 mb-2.5 p-2">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => handleChange('gender', 'Male')}
              >
                <View className="h-5 w-5 rounded-full border-2 border-primary items-center justify-center mr-1">
                  {localProfile.gender === 'Male' && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </View>
                <Text className="text-base text-textprimary">Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => handleChange('gender', 'Female')}
              >
                <View className="h-5 w-5 rounded-full border-2 border-primary items-center justify-center mr-1">
                  {localProfile.gender === 'Female' && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </View>
                <Text className="text-base text-textprimary">Female</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => handleChange('gender', 'Other')}
              >
                <View className="h-5 w-5 rounded-full border-2 border-primary items-center justify-center mr-1">
                  {localProfile.gender === 'Other' && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </View>
                <Text className="text-base text-textprimary">Other</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-1 mx-2.5 p-2 rounded-2xl border border-border flex-row justify-between items-center mt-1">
              <Text className="text-base text-textprimary font-normal">{localProfile.gender || 'Not set'}</Text>
            </View>
          )}
        </View>


        {/* Update Button */}
        <TouchableOpacity className="bg-primary p-3 rounded-lg items-center mt-6 mx-2.5 shadow-sm" onPress={handleUpdate}>
          <Text className="text-white text-base font-outfit-bold">
            {isEditing ? 'SAVE PROFILE' : 'UPDATE PROFILE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};



export default ProfileScreen;