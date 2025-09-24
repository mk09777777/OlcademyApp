import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackRouting from '@/components/BackRouting';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export default function AddressScreen() {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAddressText, setEditingAddressText] = useState('');
  const [editingAddressType, setEditingAddressType] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);

  const API_BASE_URL = 'https://backend-0wyj.onrender.com';

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getSavedAddress`, {
        withCredentials: true,
      });
      setAddresses(response.data.reverse());
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Alert.alert("Error", "Failed to load addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleMorePress = (id) => {
    setSelectedAddressId(prev => (prev === id ? null : id));
  };

  const handleEditPress = (address) => {
    setEditingAddressText(address.address || '');
    setEditingAddressType(address.service_area || '');
    setEditingAddressId(address._id);
    setEditModalVisible(true);
    setSelectedAddressId(null);
  };

  const handleDeletePress = (address) => {
    setAddressToDelete(address);
    setDeleteModalVisible(true);
    setSelectedAddressId(null);
  };

  const shareAddress = async (address) => {
    try {
      await Share.share({
        message: `My ${typeof address.service_area === 'string' ? address.service_area : JSON.stringify(address.service_area)} address: ${typeof address.address === 'string' ? address.address : JSON.stringify(address.address)}`,
        title: 'Share Address'
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share address");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAddressText || !editingAddressType) {
      Alert.alert("Error", "Address and type are required");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/UpdateUserAddress/${editingAddressId}`,
        {
          address: editingAddressText,
          service_area: editingAddressType
        },
        { withCredentials: true }
      );
      fetchAddresses();
      setEditModalVisible(false);
      Alert.alert("Success", "Address updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update address");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/DeleteUserAddress/${addressToDelete._id}`, {
        withCredentials: true,
      });
      setAddresses(prev => prev.filter(addr => addr._id !== addressToDelete._id));
      setDeleteModalVisible(false);
      Alert.alert("Success", "Address deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Failed to delete address");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Ionicons name="home" size={24} color="#f23e3e" />;
      case 'Work':
        return <MaterialCommunityIcons name="briefcase-outline" size={24} color="#f23e3e" />;
      case 'Hotel':
        return <MaterialCommunityIcons name="office-building" size={24} color="#f23e3e" />;
      default:
        return <FontAwesome5 name="map-marker-alt" size={20} color="#f23e3e" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Ionicons name="home" size={18} color="#f23e3e" />;
      case 'Work':
        return <MaterialCommunityIcons name="briefcase-outline" size={18} color="#f23e3e" />;
      case 'Hotel':
        return <MaterialCommunityIcons name="office-building" size={18} color="#f23e3e" />;
      default:
        return <FontAwesome5 name="map-marker-alt" size={16} color="#f23e3e" />;
    }
  };

  const AddressCard = ({ address }) => (
    <View className="relative mb-4">
      {selectedAddressId === address._id && (
        <View className="absolute right-0 top-0 bg-white rounded-lg shadow-lg z-10 w-35">
          <TouchableOpacity
            className="px-4 py-3"
            onPress={() => handleEditPress(address)}
          >
            <Text className="text-base text-gray-800">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-3"
            onPress={() => handleDeletePress(address)}
          >
            <Text className="text-base text-red-500 font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm" activeOpacity={1}>
        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            {getAddressIcon(address.service_area)}
            <Text className="text-base font-semibold text-gray-800 ml-2.5">
              {typeof address.service_area === 'string'
                ? address.service_area
                : address.service_area?.name || 'Unknown'}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-gray-600 leading-5 mb-2">
          {typeof address.address === 'string'
            ? address.address
            : address.address?.full || 'Unknown'}
        </Text>
        <View className="flex-row justify-end mt-2">
          <TouchableOpacity
            className="ml-5"
            onPress={() => handleMorePress(address._id)}
          >
            <Feather name="more-horizontal" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-5"
            onPress={() => shareAddress(address)}
          >
            <Feather name="share" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#f23e3e" />
        <Text className="mt-4 text-gray-600 text-base">Loading your addresses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting title="Your Address" />
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200"
        onPress={() => router.push('/AddressMapPicker')}
      >
        <Ionicons name="add" size={24} color="#f23e3e" />
        <Text className="ml-3 text-base text-red-500 font-medium flex-1">Add Address</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      <View className="h-2 bg-gray-100" />
      <View className="flex-1 p-4">
        <Text className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">SAVED ADDRESSES</Text>
        {addresses.length === 0 ? (
          <View className="flex-1 justify-center items-center p-10">
            <Ionicons name="location-outline" size={48} color="#ccc" />
            <Text className="text-lg text-gray-800 mt-4 font-medium">No saved addresses yet</Text>
            <Text className="text-sm text-gray-600 mt-2">Add your first address to get started</Text>
          </View>
        ) : (
          <FlatList
            data={addresses}
            renderItem={({ item }) => <AddressCard address={item} />}
            keyExtractor={(item) => item._id}
            className="pb-5"
            refreshing={isLoading}
            onRefresh={fetchAddresses}
          />
        )}
      </View>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-xl font-semibold mb-6 text-gray-800 text-center">Edit Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3.5 mb-6 text-base bg-gray-50 min-h-[101px]"
              style={{ textAlignVertical: 'top' }}
              value={editingAddressText}
              placeholder="Complete Address"
              onChangeText={setEditingAddressText}
              multiline
            />
            <Text className="text-base font-medium mb-3 text-gray-800">Address Type</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {['Home', 'Work', 'Hotel', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`w-[48%] flex-row items-center p-3 mb-3 border rounded-lg ${
                    editingAddressType === type 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  onPress={() => setEditingAddressType(type)}
                >
                  <View className="mr-2">
                    {getTypeIcon(type)}
                  </View>
                  <Text className="text-sm">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-lg items-center"
              onPress={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">Edit Address</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-[85%]">
            <Text className="text-lg font-semibold text-center mb-2 text-gray-800">Delete this address?</Text>
            <Text className="text-sm text-gray-600 text-center mb-6">This action cannot be undone</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className="flex-1 p-3.5 rounded-lg items-center border border-gray-300 bg-gray-50"
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text className="text-base font-medium text-gray-800">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 p-3.5 rounded-lg items-center bg-red-500 border border-red-500"
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-medium">Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

