import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <ScrollView contentContainerClassName="p-4 pb-25">
        <View className="bg-white rounded-2xl p-4 mb-5 gap-4.5">
          {/* Delivery Time */}
          <View className="flex-row items-start gap-3">
            <Feather name="clock" size={20} color="#333" />
            <View className="flex-1">
              <Text className="color-gray-700 text-sm font-outfit">
                Delivery in{' '}
                <Text className="font-outfit-bold">
                  {selectedTime ? `${dateLabels[selectedDateIndex]}, ${selectedTime}` : '25–35 mins'}
                </Text>
              </Text>

              <TouchableOpacity onPress={() => setScheduleModalVisible(true)}>
                <Text className="color-gray-600 text-sm font-outfit underline mt-0.5">Want this later? Schedule it</Text>
              </TouchableOpacity>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </View>

          {/* Address */}
          <TouchableOpacity className="flex-row items-start gap-3" onPress={() => setAddressModalVisible(true)}>
            <Entypo name="location-pin" size={20} color="#333" />
            <View className="flex-1">
              <Text className="color-gray-700 text-sm font-outfit">
                Delivery at <Text className="font-outfit-bold">{selectedAddress.type}</Text>
              </Text>
              <Text className="color-gray-500 text-sm font-outfit">
                {selectedAddress.fullAddress || `${selectedAddress.street}, ${selectedAddress.area}`}
              </Text>
              <Text className="color-gray-600 text-sm font-outfit underline mt-0.5">Add instructions for delivery partner</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>

          {/* Phone - Tap to edit */}
          <TouchableOpacity className="flex-row items-start gap-3" onPress={() => setModalVisible(true)}>
            <Feather name="phone" size={18} color="#333" />
            <View className="flex-1">
              <Text className="color-gray-700 text-sm font-outfit">
                {selectedAddress.name}, <Text className="font-outfit-bold">{selectedAddress.phone}</Text>
              </Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>

          {/* Total Bill */}
          <TouchableOpacity className="flex-row items-start gap-3" onPress={() => setBillModalVisible(true)}>
            <MaterialCommunityIcons name="receipt" size={18} color="#333" />
            <View className="flex-1">
              <View className="flex-row items-center flex-wrap gap-1.5 mt-0.5">
                <Text className="line-through color-gray-400 text-sm font-outfit">₹279</Text>
                <Text className="color-gray-900 font-outfit-bold text-sm"> ₹235 </Text>
                <View className="bg-blue-100 rounded-xl px-2 py-0.5">
                  <Text className="color-blue-600 text-xs font-outfit-semibold">You saved ₹44</Text>
                </View>
              </View>
              <Text className="color-gray-500 text-xs font-outfit mt-0.5">Incl. taxes, charges & donation</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Cancellation Policy */}
        <Text className="text-sm font-outfit-bold mt-2.5 color-gray-600">CANCELLATION POLICY</Text>
        <Text className="text-sm color-gray-500 my-1.5 leading-4.5 font-outfit">
          Help us reduce food waste by avoiding cancellations after placing your order. A 101% cancellation fee will be applied.
        </Text>

        {/* Zomato Money Card */}
        <View className="bg-white rounded-xl p-4 mt-2.5">
          <View className="flex-row items-center">
            <MaterialIcons name="account-balance-wallet" size={24} color="#e23744" />
            <View className="ml-2.5">
              <Text className="text-sm font-outfit-bold color-gray-800">Zomato Money</Text>
              <Text className="text-xs color-gray-500 mt-0.5 font-outfit">Single tap payments. Zero failures</Text>
            </View>
            <Entypo name="chevron-right" size={20} color="#aaa" className="ml-auto" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-3.5 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="#333" />
          <View className="ml-2">
            <Text className="text-xs color-gray-500 font-outfit">PAY USING</Text>
            <Text className="text-sm font-outfit-bold color-gray-700 mt-0.5">Pay on delivery</Text>
            <Text className="color-gray-500 text-xs font-outfit mt-0.5">UPI / Cash</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-red-600 rounded-lg py-2 px-3 ml-2.5 items-end">
          <Text className="text-xs color-white font-outfit-bold">₹235 TOTAL</Text>
          <Text className="text-sm color-white font-outfit-bold">Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing Receiver Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="w-11/12 bg-white rounded-2xl p-5">
            <Text className="text-base font-outfit-bold mb-2.5 color-gray-700">Update receiver details</Text>
            <Text className="text-xs color-gray-500 mb-2.5 font-outfit">
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
              className="border border-gray-300 rounded-lg p-2.5 mb-3 font-outfit"
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
              className="border border-gray-300 rounded-lg p-2.5 mb-3 font-outfit"
            />
            <TouchableOpacity className="bg-red-600 p-3 rounded-lg items-center" onPress={() => setModalVisible(false)}>
              <Text className="color-white font-outfit-bold text-sm">Submit</Text>
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
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="w-11/12 bg-white rounded-2xl p-5">
            <Text className="text-base font-outfit-bold mb-2.5 color-gray-700">Select your delivery time</Text>

            {/* Date Tabs */}
            <View className="flex-row justify-around my-2.5">
              {dateLabels.map((label, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDateIndex(index)}
                  className={`pb-1.5 border-b-2 ${selectedDateIndex === index ? 'border-red-600' : 'border-transparent'}`}
                >
                  <Text className={`${selectedDateIndex === index ? 'font-outfit-bold' : 'font-outfit'} color-gray-700`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slots */}
            <ScrollView className="max-h-45 my-2.5">
              {timeSlots.map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedTime(slot)}
                  className={`${selectedTime === slot ? 'bg-red-50' : 'bg-gray-100'} p-3 my-1.5 rounded-lg`}
                >
                  <Text className={`${selectedTime === slot ? 'color-red-600' : 'color-gray-600'} text-center font-outfit`}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={() => setScheduleModalVisible(false)}
              className={`bg-red-600 p-3 rounded-lg mt-2.5 ${selectedTime ? 'opacity-100' : 'opacity-50'}`}
              disabled={!selectedTime}
            >
              <Text className="color-white font-outfit-bold text-center">
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
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="w-11/12 bg-white rounded-2xl p-5 pb-5">
            <Text className="text-base font-outfit-bold mb-2.5 color-gray-700">Select an address</Text>
            
            <TouchableOpacity 
              className="border border-red-600 rounded-lg p-4 my-2.5 items-center"
              onPress={() => {
                setAddressModalVisible(false);
                setAddAddressModalVisible(true);
              }}
            >
              <Text className="color-red-600 font-outfit-bold">+ Add Address</Text>
            </TouchableOpacity>
            
            <View className="h-px bg-gray-200 my-2.5" />
            
            <Text className="text-sm font-outfit-bold color-gray-600 mb-2.5">SAVED ADDRESSES</Text>
            
            {addresses.map(address => (
              <TouchableOpacity 
                key={address.id}
                className="py-3 border-b border-gray-100"
                onPress={() => selectAddress(address.id)}
              >
                <View className="flex-row items-center mb-1.25">
                  <Text className="text-xs color-blue-600 mr-2.5 font-outfit">DELIVERS TO</Text>
                  <Text className="text-sm font-outfit-bold color-gray-700">{address.type}</Text>
                  {address.isSelected && (
                    <MaterialIcons 
                      name="check" 
                      size={20} 
                      color="#e23744" 
                      className="ml-auto"
                    />
                  )}
                </View>
                <Text className="text-sm color-gray-500 mb-1.25 font-outfit">
                  {address.fullAddress || `${address.street}, ${address.area}`}
                </Text>
                <Text className="text-sm color-gray-500 font-outfit">
                  {address.name}, {address.phone}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              className="mt-5 p-3 items-center"
              onPress={() => setAddressModalVisible(false)}
            >
              <Text className="color-gray-500 font-outfit-bold">Cancel</Text>
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
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="w-11/12 bg-white rounded-2xl p-5">
            <Text className="text-base font-outfit-bold mb-2.5 color-gray-700">Add New Address</Text>
            
            <Text className="text-sm color-gray-700 mb-1.25 font-outfit">Address</Text>
            <Text className="text-sm color-gray-500 mb-3.75 font-outfit">{newAddress.street}, {newAddress.area}</Text>
            
            <Text className="text-sm color-gray-700 mt-2.5 mb-1.25 font-outfit">Additional address details*</Text>
            <Text className="text-xs color-gray-400 mb-1.25 font-outfit">E.g. Floor, House no.</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-sm mb-2.5 font-outfit"
              placeholder="Enter additional details"
              value={newAddress.additional}
              onChangeText={(text) => setNewAddress({...newAddress, additional: text})}
            />
            
            <Text className="text-sm font-outfit-bold color-gray-700 mt-3.75 mb-2.5">Receiver details for this address</Text>
            
            <Text className="text-sm color-gray-700 mt-2.5 mb-1.25 font-outfit">Receiver's Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-sm mb-2.5 font-outfit"
              placeholder="Enter receiver's name"
              value={newAddress.name}
              onChangeText={(text) => setNewAddress({...newAddress, name: text})}
            />
            
            <Text className="text-sm color-gray-700 mt-2.5 mb-1.25 font-outfit">Receiver's Phone</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-sm mb-2.5 font-outfit"
              placeholder="Enter receiver's phone"
              value={newAddress.phone}
              onChangeText={(text) => setNewAddress({...newAddress, phone: text})}
              keyboardType="phone-pad"
            />
            
            <Text className="text-sm color-gray-700 mt-2.5 mb-1.25 font-outfit">Save address as</Text>
            <View className="flex-row justify-between my-2.5">
              <TouchableOpacity 
                className={`border rounded-lg p-2.5 flex-1 mx-1.25 items-center ${
                  newAddress.type === 'Home' ? 'border-red-600 bg-red-50' : 'border-gray-300'
                }`}
                onPress={() => setNewAddress({...newAddress, type: 'Home'})}
              >
                <Text className={`${newAddress.type === 'Home' ? 'color-red-600 font-outfit-bold' : 'color-gray-500 font-outfit'}`}>
                  Home
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`border rounded-lg p-2.5 flex-1 mx-1.25 items-center ${
                  newAddress.type === 'Work' ? 'border-red-600 bg-red-50' : 'border-gray-300'
                }`}
                onPress={() => setNewAddress({...newAddress, type: 'Work'})}
              >
                <Text className={`${newAddress.type === 'Work' ? 'color-red-600 font-outfit-bold' : 'color-gray-500 font-outfit'}`}>
                  Work
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`border rounded-lg p-2.5 flex-1 mx-1.25 items-center ${
                  newAddress.type === 'Other' ? 'border-red-600 bg-red-50' : 'border-gray-300'
                }`}
                onPress={() => setNewAddress({...newAddress, type: 'Other'})}
              >
                <Text className={`${newAddress.type === 'Other' ? 'color-red-600 font-outfit-bold' : 'color-gray-500 font-outfit'}`}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              className="bg-red-600 rounded-lg p-3.75 items-center mt-5"
              onPress={handleSaveAddress}
            >
              <Text className="color-white font-outfit-bold text-base">Save address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="mt-5 p-3 items-center"
              onPress={() => setAddAddressModalVisible(false)}
            >
              <Text className="color-gray-500 font-outfit-bold">Cancel</Text>
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
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="w-11/12 bg-white rounded-2xl p-5 pb-5">
            <Text className="text-base font-outfit-bold mb-2.5 color-gray-700">You saved ₹44 on this order</Text>
            <Text className="text-xs color-gray-500 mb-2.5 font-outfit">Auto-applied as your order is above ₹200</Text>
            
            <TouchableOpacity className="border border-red-600 rounded-lg p-3 my-2.5 items-center">
              <Text className="color-red-600 font-outfit-bold">View all coupons</Text>
            </TouchableOpacity>

            <Text className="text-base font-outfit-bold mt-2.5 mb-3.75 color-gray-700">Bill Summary</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-500 text-sm font-outfit">Item total</Text>
              <Text className="color-gray-700 text-sm font-outfit">₹199</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-500 text-sm font-outfit">GST and restaurant charges</Text>
              <Text className="color-gray-700 text-sm font-outfit">₹25.33</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-500 text-sm font-outfit">Delivery partner fee</Text>
              <Text className="color-gray-700 text-sm font-outfit">₹42</Text>
            </View>
            <Text className="color-gray-400 text-xs mb-2 ml-auto font-outfit">fully goes to them for their time and effort</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-500 text-sm font-outfit">Surge fee</Text>
              <Text className="color-gray-700 text-sm font-outfit">₹10</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-500 text-sm font-outfit">Platform fee</Text>
              <Text className="color-gray-700 text-sm font-outfit">₹10</Text>
            </View>
            
            <View className="flex-row justify-between mb-2 mt-2.5">
              <Text className="color-gray-600 text-sm font-outfit-bold">Grand Total</Text>
              <Text className="color-gray-800 text-sm font-outfit-bold">₹272.33</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="color-gray-600 text-sm font-outfit">Cash round off</Text>
              <Text className="color-gray-800 text-sm font-outfit">₹0.33</Text>
            </View>
            
            <View className="flex-row justify-between mb-2 mt-2.5">
              <Text className="color-gray-600 text-sm font-outfit-bold">To pay</Text>
              <Text className="color-gray-800 text-sm font-outfit-bold">₹272</Text>
            </View>

            <View className="mt-4 p-2.5 bg-blue-50 rounded-lg">
              <Text className="color-blue-600 text-sm font-outfit-semibold text-center">You saved ₹44 on this order</Text>
            </View>

            <TouchableOpacity 
              className="mt-5 bg-primary p-3 rounded-lg items-center"
              onPress={() => setBillModalVisible(false)}
            >
              <Text className="text-white font-outfit-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
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
*/

export default OrderSummary;