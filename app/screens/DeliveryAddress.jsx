import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Share,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from '@/components/BackRouting';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddressScreen() {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const [editingAddressText, setEditingAddressText] = useState('');
  const [editingAddressType, setEditingAddressType] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [manualAddressModalVisible, setManualAddressModalVisible] = useState(false);
  const [manualAddressText, setManualAddressText] = useState('');
  const [manualAddressType, setManualAddressType] = useState('Home');
  const [refreshKey, setRefreshKey] = useState(0);
  const [addressRefreshTrigger, setAddressRefreshTrigger] = useState(0);

  const API_BASE_URL = 'https://backend-0wyj.onrender.com';

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getSavedAddress`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("address fetched is", response.data);
      setAddresses(response.data.reverse()); // latest first
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (error.response?.status === 401) {
        console.log("User not authenticated, showing empty address list");
        setAddresses([]);
      } else {
        Alert.alert("Error", "Failed to load addresses. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAddresses();
      await loadSelectedAddress();
    };
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await loadSelectedAddress();
        await fetchAddresses();
        setRefreshKey(prev => prev + 1);
        setAddressRefreshTrigger(prev => prev + 1);
      };
      loadData();
    }, [])
  );

  const loadSelectedAddress = async () => {
    const savedAddress = await AsyncStorage.getItem('selectedAddress');
    if (savedAddress) {
      const addressData = JSON.parse(savedAddress);
      setSelectedAddress(addressData);
      setAddressRefreshTrigger(prev => prev + 1);
    }
  };

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
        }, {
          withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );

      // Refresh the list
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
        headers: {
          'Content-Type': 'application/json',
        },
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

const handleSuggestionSelect = async (item) => {
  try {
    const fullAddress = typeof item.address === 'string' 
      ? item.address 
      : item.address?.full || 'Unknown';
    
    const locationData = {
      fullAddress,
      service_area: item.service_area,
      address: item.address,
      _id: item._id,
      lat: item.lat || null,
      lng: item.lng || null
    };
    setSelectedAddress(locationData);

    // Save to AsyncStorage for recent addresses
    try {
      const existing = await AsyncStorage.getItem('recentlyAddList');
      let parsed = existing ? JSON.parse(existing) : [];
      parsed = parsed.filter(i => i.fullAddress !== fullAddress);
      parsed.unshift(locationData);
      if (parsed.length > 5) parsed = parsed.slice(0, 5);
      await AsyncStorage.setItem('recentlyAddList', JSON.stringify(parsed));
    } catch (err) {
      console.error("Failed to update recent list", err);
    }

    // Also save the selected address to be used in the cart
    await AsyncStorage.setItem('selectedAddress', JSON.stringify(locationData));
    
    // Navigate back to cart
    router.back();
  } catch (error) {
    console.error("Error selecting address:", error);
    Alert.alert("Error", "Failed to select address. Please try again.");
  }
};

const AddressCard = ({ address }) => {
  const addressText = typeof address.address === 'string' ? address.address : address.address?.full || 'Unknown';
  const selectedAddressText = selectedAddress?.fullAddress || 
                              (typeof selectedAddress?.address === 'string' ? selectedAddress.address : selectedAddress?.address?.full) || 
                              '';
  const isSelected = selectedAddressText && addressText === selectedAddressText;
  
  return (
  <View className="relative mb-4" key={`${address._id}-${addressRefreshTrigger}`}>
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
    <TouchableOpacity 
      className={`bg-white rounded-xl p-4 border-2 shadow-sm ${
        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
      }`}
      activeOpacity={0.7}
      onPress={() => handleSuggestionSelect(address)}
      onLongPress={() => handleMorePress(address._id)}
    >
      <View className="flex-row justify-between mb-3">
        <View className="flex-row items-center">
          {getAddressIcon(address.service_area)}
          <Text className="text-base font-semibold text-gray-800 ml-2.5">
            {typeof address.service_area === 'string'
              ? address.service_area
              : address.service_area?.name || 'Unknown'}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </View>
      <Text className="text-sm text-gray-600 leading-5 mb-2">
        {addressText}
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
};

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
      <BackRouting tittle="Your Address" />
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200"
        onPress={() => safeNavigation('/screens/MapPicker')}
      >
        <Ionicons name="add" size={24} color="#f23e3e" />
        <Text className="ml-3 text-base text-red-500 font-medium flex-1">Add Address</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      <View className="h-2 bg-gray-100" />
      <View className="flex-1 p-4" key={refreshKey}>
        <Text className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">SAVED ADDRESSES</Text>
        
        {/* Show currently selected address if it exists and is not in the list */}
        {selectedAddress && !addresses.find(addr => {
          const addrText = typeof addr.address === 'string' ? addr.address : addr.address?.full || '';
          const selectedText = selectedAddress.fullAddress || selectedAddress.address || '';
          return addrText === selectedText;
        }) && (
          <View className="mb-4">
            <Text className="text-xs font-bold text-blue-600 mb-2 uppercase">Currently Selected</Text>
            <AddressCard address={{
              _id: selectedAddress._id || 'temp',
              address: selectedAddress.fullAddress || selectedAddress.address,
              service_area: selectedAddress.service_area || 'Other'
            }} />
          </View>
        )}
        
        {addresses.length === 0 ? (
          <View className="flex-1 justify-center items-center p-10">
            <Ionicons name="location-outline" size={48} color="#ccc" />
            <Text className="text-lg text-gray-800 mt-4 font-medium">No saved addresses yet</Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">Add your first address using the map picker above or enter manually below</Text>
            <TouchableOpacity
              className="mt-6 bg-red-500 px-6 py-3 rounded-lg"
              onPress={() => setManualAddressModalVisible(true)}
            >
              <Text className="text-white font-semibold">Enter Address Manually</Text>
            </TouchableOpacity>
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

      {/* Manual Address Entry Modal */}
      <Modal
        visible={manualAddressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setManualAddressModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-xl font-semibold mb-6 text-gray-800 text-center">Enter Address Manually</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3.5 mb-6 text-base bg-gray-50 min-h-[101px]"
              style={{ textAlignVertical: 'top' }}
              value={manualAddressText}
              placeholder="Enter your complete delivery address"
              onChangeText={setManualAddressText}
              multiline
            />
            <Text className="text-base font-medium mb-3 text-gray-800">Address Type</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {['Home', 'Work', 'Hotel', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`w-[48%] flex-row items-center p-3 mb-3 border rounded-lg ${
                    manualAddressType === type 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  onPress={() => setManualAddressType(type)}
                >
                  <View className="mr-2">
                    {getTypeIcon(type)}
                  </View>
                  <Text className="text-sm">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 p-4 rounded-lg"
                onPress={() => {
                  setManualAddressModalVisible(false);
                  setManualAddressText('');
                  setManualAddressType('Home');
                }}
              >
                <Text className="text-gray-800 font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-lg"
                onPress={async () => {
                  if (manualAddressText.trim()) {
                    const manualAddress = {
                      fullAddress: manualAddressText.trim(),
                      address: manualAddressText.trim(),
                      service_area: manualAddressType,
                      _id: Date.now().toString()
                    };
                    await AsyncStorage.setItem('selectedAddress', JSON.stringify(manualAddress));
                    setManualAddressModalVisible(false);
                    setManualAddressText('');
                    setManualAddressType('Home');
                    router.back();
                  } else {
                    Alert.alert('Error', 'Please enter an address');
                  }
                }}
              >
                <Text className="text-white font-semibold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Address Modal */}
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

      {/* Delete Confirmation Modal */}
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

/* Original CSS Reference:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#666', fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyStateText: { fontSize: 18, color: '#333', marginTop: 16, fontWeight: '500' },
  emptyStateSubtext: { fontSize: 14, color: '#666', marginTop: 8 },
  addAddressButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  addAddressText: { marginLeft: 12, fontSize: 16, color: '#f23e3e', fontWeight: '500', flex: 1 },
  divider: { height: 8, backgroundColor: '#f5f5f5' },
  savedSection: { flex: 1, padding: 16 },
  savedTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  addressList: { paddingBottom: 20 },
  addressCardContainer: { position: 'relative', marginBottom: 16 },
  addressCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  addressTypeContainer: { flexDirection: 'row', alignItems: 'center' },
  addressType: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 10 },
  addressText: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 8 },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  actionButton: { marginLeft: 20 },
  dropdownMenu: { position: 'absolute', right: 0, top: 0, backgroundColor: '#fff', borderRadius: 8, elevation: 3, zIndex: 1, width: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12 },
  dropdownText: { fontSize: 15, color: '#333' },
  deleteText: { color: '#f23e3e', fontWeight: '500' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 24, color: '#333', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 24, fontSize: 15, backgroundColor: '#fafafa', minHeight: 101, textAlignVertical: 'top' },
  label: { fontSize: 15, fontWeight: '500', marginBottom: 12, color: '#333' },
  typeOptionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  typeOption: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  selectedType: { borderColor: '#f23e3e', backgroundColor: '#ffe6e6' },
  typeIcon: { marginRight: 8 },
  typeText: { fontSize: 14 },
  saveButton: { backgroundColor: '#f23e3e', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  deleteModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  deleteModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 24, width: '85%' },
  deleteModalTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8, color: '#333' },
  deleteModalSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  deleteModalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  deleteModalButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  deleteModalCancel: { borderColor: '#ddd', backgroundColor: '#f9f9f9' },
  deleteModalConfirm: { backgroundColor: '#f23e3e', borderColor: '#f23e3e' },
  deleteModalButtonText: { fontSize: 15, fontWeight: '500', color: '#333' },
  deleteModalConfirmText: { color: 'white', fontWeight: '500' }
});
*/