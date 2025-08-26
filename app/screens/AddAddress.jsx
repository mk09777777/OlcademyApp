import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Delivery details</Text>

      <Text style={styles.addressPreview}>{address || 'No address selected yet'}</Text>

      <TouchableOpacity
        onPress={handleSelectFromMap}
        style={styles.mapButton}
      >
        <View style={styles.mapButtonContent}>
          <Icon name="map-pin" size={20} color="#f23e3e" />
          <Text style={styles.mapButtonText}>Select location from the map</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#aaa" />
      </TouchableOpacity>

      <Text style={styles.label}>Additional address details*</Text>
      <Text style={styles.subLabel}>E.g. Floor, House no.</Text>
      <TextInput
        placeholder="Enter additional details"
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Save address as</Text>
      <View style={styles.tagContainer}>
        {tagOptions.map(({ type, icon }) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            style={[
              styles.tag,
              selectedType === type && styles.selectedTag
            ]}
          >
            {icon}
            <Text style={[
              styles.tagText,
              selectedType === type && styles.selectedTagText
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleUploadAddress}
        style={[
          styles.saveButton,
          !isAddressFilled && styles.disabledButton,
          isAdditionalDetailsFilled && styles.activeButton
        ]}
        disabled={!isAddressFilled}
      >
        <Text style={styles.saveButtonText}>Save address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addressPreview: {
    marginBottom: 20,
    color: '#666',
    fontSize: 16,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButtonText: {
    marginLeft: 10,
    fontWeight: '500',
    color: '#333',
    fontSize: 16,
  },
  label: {
    marginBottom: 6,
    color: '#666',
    fontSize: 14,
  },
  subLabel: {
    marginBottom: 10,
    fontSize: 12,
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  sectionTitle: {
    fontWeight: '500',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedTag: {
    borderColor: '#f23e3e',
    backgroundColor: '#ffe6e6',
  },
  tagText: {
    marginLeft: 8,
    color: '#555',
  },
  selectedTagText: {
    color: '#f23e3e',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f23e3e', // Zomato-like red color
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  activeButton: {
    backgroundColor: '#cb202d', 
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});