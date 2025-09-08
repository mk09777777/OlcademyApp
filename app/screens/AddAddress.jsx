import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { router } from 'expo-router';
import { API_CONFIG } from '../../config/apiConfig';

export default function AddAddressScreen() {
  const [address, setAddress] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [selectedType, setSelectedType] = useState('Home');

  const isAddressFilled = address.trim().length > 0;
  const isAdditionalDetailsFilled = additionalDetails.trim().length > 0;

  const tagOptions = [
    { type: 'Home', icon: <Icon name="home" size={18} color="#555" /> },
    { type: 'Work', icon: <MaterialCommunityIcons name="briefcase-outline" size={18} color="#555" /> },
    { type: 'Other', icon: <FontAwesome5 name="map-marker-alt" size={16} color="#555" /> },
  ];
  const handleSelectFromMap = () => {
    router.push('MapPicker');
  };
  const handleUploadAddress = async () => {
    if (!address) {
      alert('Please enter address');
      return;
    }
    const addressUpload = additionalDetails ? `${address}, ${additionalDetails}` : address;
    const serviceArea = selectedType;

    try {

      await axios.post(`${API_CONFIG.BACKEND_URL}/api/createUserAddress`, [
        {
          address: addressUpload,
          service_area: serviceArea
        }
      ], {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Address uploaded");
      router.push("screens/Address");
    } catch (error) {
      console.error("error in uploading the address", error.response?.data || error.message);
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-xl font-outfit-bold mb-4 text-textprimary">Delivery details</Text>

      <Text className="mb-5 text-textsecondary text-base font-outfit">{address || 'No address selected yet'}</Text>

      <TouchableOpacity
        onPress={handleSelectFromMap}
        className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-6 border border-border shadow-sm"
      >
        <View className="flex-row items-center">
          <Icon name="map-pin" size={20} color="#FF002E" />
          <Text className="ml-3 font-outfit text-textprimary text-base">Select location from the map</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#aaa" />
      </TouchableOpacity>

      <Text className="mb-2 text-textsecondary text-sm font-outfit">Additional address details*</Text>
      <Text className="mb-3 text-xs text-textsecondary font-outfit">E.g. Floor, House no.</Text>
      <TextInput
        placeholder="Enter additional details"
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
        className="border border-border p-4 rounded-lg mb-6 text-base bg-light font-outfit"
      />

      <Text className="font-outfit text-base mb-4 text-textprimary">Save address as</Text>
      <View className="flex-row mb-8">
        {tagOptions.map(({ type, icon }) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            className={`flex-row items-center py-3 px-4 mr-3 border rounded-full ${
              selectedType === type ? 'border-primary bg-light' : 'border-border bg-white'
            }`}
          >
            {icon}
            <Text className={`ml-2 font-outfit ${
              selectedType === type ? 'text-primary font-outfit-bold' : 'text-textsecondary'
            }`}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleUploadAddress}
        className={`py-4 items-center rounded-lg mt-3 ${
          !isAddressFilled ? 'bg-border' : isAdditionalDetailsFilled ? 'bg-primary' : 'bg-primary'
        }`}
        disabled={!isAddressFilled}
      >
        <Text className="text-white font-outfit-bold text-base">Save address</Text>
      </TouchableOpacity>
    </View>
  );
}

