import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import {
  Feather,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';
const OrderSummary = () => {
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#f3f4f6' }
   * scroll: { padding: 16, paddingBottom: 101 }
   * card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20, gap: 18 }
   * row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }
   * info: { flex: 1 }
   * label: { color: '#333', fontSize: 14 }
   * bold: { fontWeight: 'bold' }
   * link: { color: '#444', fontSize: 13, textDecorationLine: 'underline', marginTop: 2 }
   * address: { color: '#666', fontSize: 13 }
   * striked: { textDecorationLine: 'line-through', color: '#999', fontSize: 13 }
   * boldPrice: { color: '#111', fontWeight: 'bold', fontSize: 14 }
   * billRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 2 }
   * badge: { backgroundColor: '#e2ebfb', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }
   * badgeText: { color: '#3c73d3', fontSize: 12, fontWeight: '600' }
   * subLabel: { color: '#888', fontSize: 12, marginTop: 2 }
   * cancelTitle: { fontSize: 13, fontWeight: 'bold', marginTop: 10, color: '#555' }
   * cancelText: { fontSize: 13, color: '#777', marginVertical: 6, lineHeight: 18 }
   * paymentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 10 }
   * paymentRow: { flexDirection: 'row', alignItems: 'center' }
   * walletTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' }
   * walletDesc: { fontSize: 12, color: '#666', marginTop: 2 }
   * footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
   * paymentMethod: { flexDirection: 'row', alignItems: 'center', flex: 1 }
   * payUsing: { fontSize: 10, color: '#888' }
   * payMethod: { fontSize: 13, fontWeight: 'bold', color: '#333', marginTop: 2 }
   * placeOrderBtn: { backgroundColor: '#e23744', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginLeft: 10, alignItems: 'flex-end' }
   * totalText: { fontSize: 12, color: '#fff', fontWeight: 'bold' }
   * placeText: { fontSize: 14, color: '#fff', fontWeight: 'bold' }
   * modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }
   * modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 10 }
   * modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }
   * modalSub: { fontSize: 12, color: '#666', marginBottom: 10 }
   * input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 }
   * submitBtn: { backgroundColor: '#e23744', padding: 12, borderRadius: 8, alignItems: 'center' }
   * submitText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
   */
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);

  const [receiverName, setReceiverName] = useState('shrija');
  const [receiverPhone, setReceiverPhone] = useState('+91 9121357033');

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const dateLabels = ['Today', 'Tomorrow', 'Saturday'];
  const timeSlots = ['9 – 9:30 PM', '9:30 – 10 PM', '10 – 10:30 PM'];

  // Address state management
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      street: 'santhoshi Matha nilayam, Shubodaya Colony, Bandam Kommu',
      additional: '',
      area: 'Chanda Nagar, Ramachandrapuram',
      name: 'Shrija',
      phone: '+91 9121357033',
      isSelected: true
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    street: 'Shubodaya Colony, Bandam Kommu',
    additional: '',
    area: 'Chanda Nagar, Hyderabad',
    name: 'Shrija',
    phone: '+91 9121357033',
    type: 'Home'
  });

  // Handle saving a new address
  const handleSaveAddress = () => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isSelected: false
    }));
    
    const fullAddress = newAddress.additional 
      ? `${newAddress.street}, ${newAddress.additional}, ${newAddress.area}`
      : `${newAddress.street}, ${newAddress.area}`;

    const newAddressObj = {
      id: Date.now().toString(),
      ...newAddress,
      isSelected: true,
      fullAddress: fullAddress
    };

    setAddresses([...updatedAddresses, newAddressObj]);
    setAddAddressModalVisible(false);
    setAddressModalVisible(true);
    
    // Reset new address form
    setNewAddress({
      street: 'Shubodaya Colony, Bandam Kommu',
      additional: '',
      area: 'Chanda Nagar, Hyderabad',
      name: 'Shrija',
      phone: '+91 9121357033',
      type: 'Home'
    });
  };

  // Select an address
  const selectAddress = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isSelected: addr.id === id
    }));
    setAddresses(updatedAddresses);
    setAddressModalVisible(false);
  };

  // Get the selected address
  const selectedAddress = addresses.find(addr => addr.isSelected) || addresses[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <BackRouting tittle="Order Summary"/>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 101 }}>
        <View className="bg-white rounded-2xl p-4 mb-5" style={{ gap: 18 }}>
          {/* Delivery Time */}
          <View style={styles.row}>
            <Feather name="clock" size={20} color="#333" />
            <View style={styles.info}>
              <Text style={styles.label}>
                Delivery in{' '}
                <Text style={styles.bold}>
                  {selectedTime ? `${dateLabels[selectedDateIndex]}, ${selectedTime}` : '25–35 mins'}
                </Text>
              </Text>

              <TouchableOpacity onPress={() => setScheduleModalVisible(true)}>
                <Text style={styles.link}>Want this later? Schedule it</Text>
              </TouchableOpacity>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </View>

          {/* Address */}
          <TouchableOpacity style={styles.row} onPress={() => setAddressModalVisible(true)}>
            <Entypo name="location-pin" size={20} color="#333" />
            <View style={styles.info}>
              <Text style={styles.label}>
                Delivery at <Text style={styles.bold}>{selectedAddress.type}</Text>
              </Text>
              <Text style={styles.address}>
                {selectedAddress.fullAddress || `${selectedAddress.street}, ${selectedAddress.area}`}
              </Text>
              <Text style={styles.link}>Add instructions for delivery partner</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>

          {/* Phone - Tap to edit */}
          <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)}>
            <Feather name="phone" size={18} color="#333" />
            <View style={styles.info}>
              <Text style={styles.label}>
                {selectedAddress.name}, <Text style={styles.bold}>{selectedAddress.phone}</Text>
              </Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>

          {/* Total Bill */}
          <TouchableOpacity style={styles.row} onPress={() => setBillModalVisible(true)}>
            <MaterialCommunityIcons name="receipt" size={18} color="#333" />
            <View style={styles.info}>
              <View style={styles.billRow}>
                <Text style={styles.striked}>₹279</Text>
                <Text style={styles.boldPrice}> ₹235 </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>You saved ₹44</Text>
                </View>
              </View>
              <Text style={styles.subLabel}>Incl. taxes, charges & donation</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Cancellation Policy */}
        <Text style={styles.cancelTitle}>CANCELLATION POLICY</Text>
        <Text style={styles.cancelText}>
          Help us reduce food waste by avoiding cancellations after placing your order. A 101% cancellation fee will be applied.
        </Text>

        {/* Zomato Money Card */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#e23744" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.walletTitle}>Zomato Money</Text>
              <Text style={styles.walletDesc}>Single tap payments. Zero failures</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" style={{ marginLeft: 'auto' }} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.footer}>
        <View style={styles.paymentMethod}>
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="#333" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.payUsing}>PAY USING</Text>
            <Text style={styles.payMethod}>Pay on delivery</Text>
            <Text style={styles.subLabel}>UPI / Cash</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.placeOrderBtn}>
          <Text style={styles.totalText}>₹235 TOTAL</Text>
          <Text style={styles.placeText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing Receiver Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update receiver details</Text>
            <Text style={styles.modalSub}>
              {selectedAddress.type} - {selectedAddress.fullAddress || `${selectedAddress.street}, ${selectedAddress.area}`}
            </Text>

            <TextInput
              placeholder="Receiver's name"
              value={selectedAddress.name}
              onChangeText={(text) => {
                const updatedAddresses = addresses.map(addr => 
                  addr.id === selectedAddress.id ? {...addr, name: text} : addr
                );
                setAddresses(updatedAddresses);
              }}
              style={styles.input}
            />
            <TextInput
              placeholder="Receiver's mobile number"
              value={selectedAddress.phone}
              onChangeText={(text) => {
                const updatedAddresses = addresses.map(addr => 
                  addr.id === selectedAddress.id ? {...addr, phone: text} : addr
                );
                setAddresses(updatedAddresses);
              }}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Delivery Modal */}
      <Modal
        visible={scheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select your delivery time</Text>

            {/* Date Tabs */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 10,
              }}
            >
              {dateLabels.map((label, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDateIndex(index)}
                  style={{
                    paddingBottom: 6,
                    borderBottomWidth: 2,
                    borderColor: selectedDateIndex === index ? '#e23744' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: selectedDateIndex === index ? 'bold' : 'normal',
                      color: '#333',
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slots */}
            <ScrollView style={{ maxHeight: 180, marginVertical: 10 }}>
              {timeSlots.map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedTime(slot)}
                  style={{
                    backgroundColor: selectedTime === slot ? '#ffe8e8' : '#f2f2f2',
                    padding: 12,
                    marginVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: selectedTime === slot ? '#e23744' : '#555',
                      textAlign: 'center',
                    }}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={() => setScheduleModalVisible(false)}
              style={{
                backgroundColor: '#e23744',
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
                opacity: selectedTime ? 1 : 0.5,
              }}
              disabled={!selectedTime}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Address Selection Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 20 }]}>
            <Text style={styles.modalTitle}>Select an address</Text>
            
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={() => {
                setAddressModalVisible(false);
                setAddAddressModalVisible(true);
              }}
            >
              <Text style={styles.addAddressText}>+ Add Address</Text>
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <Text style={styles.savedAddressesTitle}>SAVED ADDRESSES</Text>
            
            {addresses.map(address => (
              <TouchableOpacity 
                key={address.id}
                style={styles.addressItem}
                onPress={() => selectAddress(address.id)}
              >
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>DELIVERS TO</Text>
                  <Text style={styles.addressName}>{address.type}</Text>
                  {address.isSelected && (
                    <MaterialIcons 
                      name="check" 
                      size={20} 
                      color="#e23744" 
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </View>
                <Text style={styles.addressDetails}>
                  {address.fullAddress || `${address.street}, ${address.area}`}
                </Text>
                <Text style={styles.receiverDetails}>
                  {address.name}, {address.phone}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        visible={addAddressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 20 }]}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            
            <Text style={styles.addressLabel}>Address</Text>
            <Text style={styles.addressText}>{newAddress.street}, {newAddress.area}</Text>
            
            <Text style={styles.inputLabel}>Additional address details*</Text>
            <Text style={styles.inputSubLabel}>E.g. Floor, House no.</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter additional details"
              value={newAddress.additional}
              onChangeText={(text) => setNewAddress({...newAddress, additional: text})}
            />
            
            <Text style={styles.sectionTitle}>Receiver details for this address</Text>
            
            <Text style={styles.inputLabel}>Receiver's Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter receiver's name"
              value={newAddress.name}
              onChangeText={(text) => setNewAddress({...newAddress, name: text})}
            />
            
            <Text style={styles.inputLabel}>Receiver's Phone</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter receiver's phone"
              value={newAddress.phone}
              onChangeText={(text) => setNewAddress({...newAddress, phone: text})}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Save address as</Text>
            <View style={styles.addressTypeContainer}>
              <TouchableOpacity 
                style={[
                  styles.addressTypeButton,
                  newAddress.type === 'Home' && styles.addressTypeButtonSelected
                ]}
                onPress={() => setNewAddress({...newAddress, type: 'Home'})}
              >
                <Text style={newAddress.type === 'Home' ? styles.addressTypeTextSelected : styles.addressTypeText}>
                  Home
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.addressTypeButton,
                  newAddress.type === 'Work' && styles.addressTypeButtonSelected
                ]}
                onPress={() => setNewAddress({...newAddress, type: 'Work'})}
              >
                <Text style={newAddress.type === 'Work' ? styles.addressTypeTextSelected : styles.addressTypeText}>
                  Work
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.addressTypeButton,
                  newAddress.type === 'Other' && styles.addressTypeButtonSelected
                ]}
                onPress={() => setNewAddress({...newAddress, type: 'Other'})}
              >
                <Text style={newAddress.type === 'Other' ? styles.addressTypeTextSelected : styles.addressTypeText}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.saveAddressButton}
              onPress={handleSaveAddress}
            >
              <Text style={styles.saveAddressButtonText}>Save address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setAddAddressModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bill Summary Modal */}
      <Modal
        visible={billModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBillModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 20 }]}>
            <Text style={styles.modalTitle}>You saved ₹44 on this order</Text>
            <Text style={styles.modalSub}>Auto-applied as your order is above ₹200</Text>
            
            <TouchableOpacity style={styles.viewCouponsButton}>
              <Text style={styles.viewCouponsText}>View all coupons</Text>
            </TouchableOpacity>

            <Text style={styles.billSummaryTitle}>Bill Summary</Text>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Item total</Text>
              <Text style={styles.billValue}>₹199</Text>
            </View>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>GST and restaurant charges</Text>
              <Text style={styles.billValue}>₹25.33</Text>
            </View>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Delivery partner fee</Text>
              <Text style={styles.billValue}>₹42</Text>
            </View>
            <Text style={styles.billSubtext}>fully goes to them for their time and effort</Text>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Surge fee</Text>
              <Text style={styles.billValue}>₹10</Text>
            </View>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Platform fee</Text>
              <Text style={styles.billValue}>₹10</Text>
            </View>
            
            <View style={[styles.billRowItem, { marginTop: 10 }]}>
              <Text style={[styles.billLabel, { fontWeight: 'bold' }]}>Grand Total</Text>
              <Text style={[styles.billValue, { fontWeight: 'bold' }]}>₹272.33</Text>
            </View>
            
            <View style={styles.billRowItem}>
              <Text style={styles.billLabel}>Cash round off</Text>
              <Text style={styles.billValue}>₹0.33</Text>
            </View>
            
            <View style={[styles.billRowItem, { marginTop: 10 }]}>
              <Text style={[styles.billLabel, { fontWeight: 'bold' }]}>To pay</Text>
              <Text style={[styles.billValue, { fontWeight: 'bold' }]}>₹272</Text>
            </View>

            <View style={styles.savingsContainer}>
              <Text style={styles.savingsText}>You saved ₹44 on this order</Text>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setBillModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scroll: { padding: 16, paddingBottom: 101 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  info: { flex: 1 },
  label: { color: '#333', fontSize: 14 },
  bold: { fontWeight: 'bold' },
  link: {
    color: '#444',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  address: { color: '#666', fontSize: 13 },
  striked: { textDecorationLine: 'line-through', color: '#999', fontSize: 13 },
  boldPrice: { color: '#111', fontWeight: 'bold', fontSize: 14 },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#e2ebfb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: '#3c73d3', fontSize: 12, fontWeight: '600' },
  subLabel: { color: '#888', fontSize: 12, marginTop: 2 },

  cancelTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  cancelText: {
    fontSize: 13,
    color: '#777',
    marginVertical: 6,
    lineHeight: 18,
  },

  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  walletDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payUsing: {
    fontSize: 10,
    color: '#888',
  },
  payMethod: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  placeOrderBtn: {
    backgroundColor: '#e23744',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#e23744',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: '#e23744',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
  },
  addAddressText: {
    color: '#e23744',
    fontWeight: 'bold',
  },
  importAddressButton: {
    borderWidth: 1,
    borderColor: '#e23744',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
  },
  importAddressText: {
    color: '#e23744',
    fontWeight: 'bold',
  },
  importAddressSubText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  savedAddressesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  addressItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressType: {
    fontSize: 12,
    color: 'blue',
    marginRight: 10,
  },
  addressName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addressDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  receiverDetails: {
    fontSize: 13,
    color: '#666',
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },

  // Bill Summary Modal Styles
  viewCouponsButton: {
    borderWidth: 1,
    borderColor: '#e23744',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  viewCouponsText: {
    color: '#e23744',
    fontWeight: 'bold',
  },
  billSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  billRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    color: '#666',
    fontSize: 14,
  },
  billValue: {
    color: '#333',
    fontSize: 14,
  },
  billSubtext: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 'auto',
  },
  savingsContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  savingsText: {
    color: '#3c73d3',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e23744',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  inputSubLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  addressTypeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  addressTypeButtonSelected: {
    borderColor: '#e23744',
    backgroundColor: '#ffe8e8',
  },
  addressTypeText: {
    color: '#666',
  },
  addressTypeTextSelected: {
    color: '#e23744',
    fontWeight: 'bold',
  },
  saveAddressButton: {
    backgroundColor: '#e23744',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveAddressButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderSummary;