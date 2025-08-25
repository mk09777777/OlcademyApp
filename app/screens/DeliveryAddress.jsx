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
  StyleSheet
} from 'react-native';
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
  // Local input states for editing
  const [editingAddressText, setEditingAddressText] = useState('');
  const [editingAddressType, setEditingAddressType] = useState('');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

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
    
    // Show success message
    Alert.alert("Success", "Address selected successfully!");
    
    // Navigate to cart
    safeNavigation('/screens/TakeAwayCart');
  } catch (error) {
    console.error("Error selecting address:", error);
    Alert.alert("Error", "Failed to select address. Please try again.");
  }
};

const AddressCard = ({ address }) => (
  <View style={styles.addressCardContainer}>
    {selectedAddressId === address._id && (
      <View style={styles.dropdownMenu}>
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => handleEditPress(address)}
        >
          <Text style={styles.dropdownText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => handleDeletePress(address)}
        >
          <Text style={[styles.dropdownText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    )}
    <TouchableOpacity 
      style={[
        styles.addressCard,
        selectedAddress?._id === address._id && styles.selectedAddressCard
      ]} 
      activeOpacity={0.7}
      onPress={() => handleSuggestionSelect(address)}
      onLongPress={() => handleMorePress(address._id)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          {getAddressIcon(address.service_area)}
          <Text style={styles.addressType}>
            {typeof address.service_area === 'string'
              ? address.service_area
              : address.service_area?.name || 'Unknown'}
          </Text>
        </View>
        {selectedAddress?._id === address._id && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </View>
      <Text style={styles.addressText}>
        {typeof address.address === 'string'
          ? address.address
          : address.address?.full || 'Unknown'}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleMorePress(address._id)}
        >
          <Feather name="more-horizontal" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
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
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#f23e3e" />
        <Text style={styles.loadingText}>Loading your addresses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackRouting tittle="Your Address" />
      <TouchableOpacity
        style={styles.addAddressButton}
        onPress={() => safeNavigation('MapPicker')}
      >
        <Ionicons name="add" size={24} color="#f23e3e" />
        <Text style={styles.addAddressText}>Add Address</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      <View style={styles.divider} />
      <View style={styles.savedSection}>
        <Text style={styles.savedTitle}>SAVED ADDRESSES</Text>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No saved addresses yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first address to get started</Text>
          </View>
        ) : (
          <FlatList
            data={addresses}
            renderItem={({ item }) => <AddressCard address={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
            refreshing={isLoading}
            onRefresh={fetchAddresses}
          />
        )}
      </View>

      {/* Edit Address Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={styles.input}
              value={editingAddressText}
              placeholder="Complete Address"
              onChangeText={setEditingAddressText}
              multiline
            />
            <Text style={styles.label}>Address Type</Text>
            <View style={styles.typeOptionsContainer}>
              {['Home', 'Work', 'Hotel', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    editingAddressType === type && styles.selectedType
                  ]}
                  onPress={() => setEditingAddressType(type)}
                >
                  <View style={styles.typeIcon}>
                    {getTypeIcon(type)}
                  </View>
                  <Text style={styles.typeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Edit Address</Text>
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
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete this address?</Text>
            <Text style={styles.deleteModalSubtitle}>This action cannot be undone</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.deleteModalCancel]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.deleteModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.deleteModalConfirm]}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.deleteModalConfirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addAddressText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#f23e3e',
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  savedSection: {
    flex: 1,
    padding: 16,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressList: {
    paddingBottom: 20,
  },
  addressCardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 20,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    zIndex: 1,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
  deleteText: {
    color: '#f23e3e',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
    fontSize: 15,
    backgroundColor: '#fafafa',
    minHeight: 101,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  typeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedType: {
    borderColor: '#f23e3e',
    backgroundColor: '#ffe6e6',
  },
  typeIcon: {
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#f23e3e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deleteModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '85%',
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  deleteModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  deleteModalCancel: {
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  deleteModalConfirm: {
    backgroundColor: '#f23e3e',
    borderColor: '#f23e3e',
  },
  deleteModalButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  deleteModalConfirmText: {
    color: 'white',
    fontWeight: '500',
  },
});