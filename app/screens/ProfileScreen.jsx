import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import BackRouting from '@/components/BackRouting';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
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
    });
  };

  const handleUpdate = async () => {
    if (isEditing) {
      try {
        const updatedProfile = {
          ...user,
          username: localProfile.name,
          email: localProfile.email,
          dob: localProfile.dob.toISOString(),
          anniversary: localProfile.anniversary.toISOString(),
          gender: localProfile.gender,
          mobile: localProfile.mobile
        };

        await axios.post(`${API_CONFIG.BACKEND_URL}/user/profileEdit`, updatedProfile, {
          withCredentials: true
        });

        await AsyncStorage.setItem('userData', JSON.stringify(updatedProfile));
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate =
      selectedDate || (fieldToUpdate === 'dob' ? localProfile.dob : localProfile.anniversary);
    if (fieldToUpdate === 'dob') {
      setShowDobPicker(false);
      handleChange('dob', currentDate);
    } else {
      setShowAnniversaryPicker(false);
      handleChange('anniversary', currentDate);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <BackRouting />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Profile Picture */}
        <View className="items-center mt-6 mb-4">
          {localProfile.profileImage ? (
            <Image
              source={{ uri: localProfile.profileImage }}
              resizeMode="contain"
              className="w-40 h-40 rounded-full border-4 border-primary"
            />
          ) : (
            <View className="w-40 h-40 rounded-full bg-light justify-center items-center border-4 border-primary">
              <Text className="text-5xl text-primary font-outfit-bold">{profileInitial}</Text>
            </View>
          )}
        </View>

        {/* Field Container */}
        <View className="bg-white rounded-xl shadow-sm p-4">
          {/* Field Template */}
          {[
            { label: 'Name', icon: <AntDesign name="user" size={22} color="#FF002E" />, key: 'name' },
            { label: 'Email', icon: <Fontisto name="email" size={22} color="#FF002E" />, key: 'email' },
            { label: 'Mobile', icon: <Ionicons name="call-outline" size={22} color="#FF002E" />, key: 'mobile' }
          ].map(({ label, icon, key }) => (
            <View key={key} className="mb-4">
              <View className="flex-row items-center mb-2">
                {icon}
                <Text className="text-base font-outfit-bold ml-2 text-textprimary">{label}</Text>
              </View>
              <View className="border border-border rounded-lg px-3 py-2">
                {isEditing && key !== 'email' ? (
                  <TextInput
                    value={(localProfile )[key]}
                    onChangeText={text => handleChange(key, text)}
                    className="text-base text-textprimary"
                    keyboardType={key === 'mobile' ? 'phone-pad' : 'default'}
                  />
                ) : (
                  <Text className="text-base text-textsecondary">
                    {(localProfile)[key] || 'Not set'}
                  </Text>
                )}
              </View>
            </View>
          ))}

          {/* DOB Field */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Fontisto name="date" size={22} color="#FF002E" />
              <Text className="text-base font-outfit-bold ml-2 text-textprimary">Date of Birth</Text>
            </View>
            <TouchableOpacity
              className="border border-border rounded-lg px-3 py-2"
              onPress={() => {
                if (isEditing) {
                  setFieldToUpdate('dob');
                  setShowDobPicker(true);
                }
              }}
            >
              <Text className="text-base text-textsecondary">{formatDate(localProfile.dob)}</Text>
            </TouchableOpacity>
            {showDobPicker && (
              <DateTimePicker value={localProfile.dob} mode="date" onChange={handleDateChange} />
            )}
          </View>

          {/* Anniversary */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Fontisto name="date" size={22} color="#FF002E" />
              <Text className="text-base font-outfit-bold ml-2 text-textprimary">Anniversary</Text>
            </View>
            <TouchableOpacity
              className="border border-border rounded-lg px-3 py-2"
              onPress={() => {
                if (isEditing) {
                  setFieldToUpdate('anniversary');
                  setShowAnniversaryPicker(true);
                }
              }}
            >
              <Text className="text-base text-textsecondary">{formatDate(localProfile.anniversary)}</Text>
            </TouchableOpacity>
            {showAnniversaryPicker && (
              <DateTimePicker value={localProfile.anniversary} mode="date" onChange={handleDateChange} />
            )}
          </View>

          {/* Gender */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <AntDesign name="user" size={22} color="#FF002E" />
              <Text className="text-base font-outfit-bold ml-2 text-textprimary">Gender</Text>
            </View>
            {isEditing ? (
              <View className="flex-row justify-between px-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <TouchableOpacity key={g} onPress={() => handleChange('gender', g)} className="flex-row items-center">
                    <View className="h-5 w-5 rounded-full border-2 border-primary items-center justify-center mr-1">
                      {localProfile.gender === g && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </View>
                    <Text className="text-base text-textprimary">{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="border border-border rounded-lg px-3 py-2">
                <Text className="text-base text-textsecondary">{localProfile.gender}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          className="bg-primary p-3 rounded-lg items-center mt-6 shadow-sm"
          onPress={handleUpdate}
        >
          <Text className="text-white text-lg font-outfit-bold">
            {isEditing ? 'SAVE PROFILE' : 'EDIT PROFILE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
