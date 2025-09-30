import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
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
    { type: 'Home', icon: <Feather name="home" size={18} color="#666666" /> },
    { type: 'Work', icon: <MaterialCommunityIcons name="briefcase-outline" size={18} color="#666666" /> },
    { type: 'Other', icon: <FontAwesome5 name="map-marker-alt" size={16} color="#666666" /> },
  ];
  const handleSelectFromMap = () => {
    router.push('MapPicker');
  };
  const handleUploadAddress = async () => {
    if (!additionalDetails.trim()) {
      alert('Please enter additional details');
      return;
    }
    const addressUpload = address ? `${address}, ${additionalDetails}` : additionalDetails;
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
      <Text className="text-xl font-bold mb-4 text-textprimary">Delivery details</Text>

      <Text className="mb-5 text-smalltext text-base">{address || 'No address selected yet'}</Text>

      <TouchableOpacity
        onPress={handleSelectFromMap}
        className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-6 border border-border shadow-sm"
      >
        <View className="flex-row items-center">
          <Feather name="map-pin" size={20} color="#02757A" />
          <Text className="ml-2.5 font-medium text-textprimary text-base">Select location from the map</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#aaa" />
      </TouchableOpacity>

      <Text className="mb-1.5 text-smalltext text-sm">Additional address details*</Text>
      <Text className="mb-2.5 text-xs text-smalltext">E.g. Floor, House no.</Text>
      <TextInput
        placeholder="Enter additional details"
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
        className="border border-border p-3.5 rounded-2xl mb-6 text-base bg-light"
      />

      <Text className="font-medium mb-4 text-base text-textprimary">Save address as</Text>
      <View className="flex-row mb-7">
        {tagOptions.map(({ type, icon }) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            className={`flex-row items-center py-2.5 px-4 mr-3 border rounded-full ${
              selectedType === type 
                ? 'border-primary bg-primary/10' 
                : 'border-border bg-white'
            }`}
          >
            {icon}
            <Text className={`ml-2 ${
              selectedType === type 
                ? 'text-primary font-bold' 
                : 'text-smalltext'
            }`}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleUploadAddress}
        className={`py-4 items-center rounded-2xl mt-2.5 ${
          isAdditionalDetailsFilled 
            ? 'bg-primary' 
            : 'bg-border'
        }`}
        disabled={!isAdditionalDetailsFilled}
      >
        <Text className="text-white font-bold text-base">Save address</Text>
      </TouchableOpacity>
    </View>
  );
}

