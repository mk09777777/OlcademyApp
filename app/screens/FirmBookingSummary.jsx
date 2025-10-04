import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddRequest from '../../components/AddRequest'
import InputModalEdit from '../../components/updateNameModal';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { API_CONFIG } from '../../config/apiConfig';
import { api } from '../../config/httpClient'; 

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function FirmBookingSummary() {
  const { firmName, date, guestCount, time, name, email, contact, firmadd, firmId, selectedTab, offerId,offerDetails } = useGlobalSearchParams()
  const parsedOffer = offerDetails ? JSON.parse(offerDetails) : 0;
  const [RequestModal, setRequestModal] = useState(false)
  const [requestDataa, setReqestData] = useState(null)
  const [reqeststate, setreqestState] = useState(false)
  const [inputModal, setInputModal] = useState(false)
  const [updatedData, setupdatedData] = useState(null)    
  const [enableAll, setEnableAll] = useState(false);
  const [promosPush, setPromosPush] = useState(false);
  const [promosWhatsapp, setPromosWhatsapp] = useState(false);
  const [socialPush, setSocialPush] = useState(false);
  const [ordersPush, setOrdersPush] = useState(false);
  const [ordersWhatsapp, setOrdersWhatsapp] = useState(false);

    const initialState = useRef({
          enableAll: false,
          promosPush: false,
          promosWhatsapp: false,
          socialPush: false,
          ordersPush: false,
          ordersWhatsapp: false,
      });
  //http://localhost:3000/api/bookings?id=685c0b9d76ea9cadb4dbfd65
  //  http://192.168.0.107:3000/api/saveOrders
  const handleRequestData = (data, item) => {
    setReqestData({ data, item });
    if (data || item) {

      setreqestState(true)
    }
  };

  const toggleRequestModal = () => {
    setRequestModal(!RequestModal)
  }

  const handleDelete = () => {
    setreqestState(false)
    setReqestData(null)
  }

  const toggleInputModal = () => {
    setInputModal(!inputModal)
  }

  const handleUpdated = (name, contact) => {
    setupdatedData({ name, contact })
  }

    const fetchInitialSettings = async () => {
    try {

      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/getnotifications`, {
        method: 'GET',
        credentials: 'include',
      });
      const settings = await response.json();

      setEnableAll(settings.enableAll);
      setPromosPush(settings.promoPush);
      setPromosWhatsapp(settings.promoWhatsapp);
      setSocialPush(settings.socialPush);
      setOrdersPush(settings.orderPush);
      setOrdersWhatsapp(settings.orderWhatsapp);

      initialState.current = {
        enableAll: settings.enableAll,
        promosPush: settings.promoPush,
        promosWhatsapp: settings.promoWhatsapp,
        socialPush: settings.socialPush,
        ordersPush: settings.orderPush,
        ordersWhatsapp: settings.orderWhatsapp,
      };
    } catch (error) {
      console.error("Error fetching notification settings", error);
    }
  };

  useEffect(()=>{
    console.log("offer details are",parsedOffer,firmId,firmName,date,guestCount,time,name,email,contact,selectedTab,offerId);
fetchInitialSettings()
  },[enableAll,promosPush,promosWhatsapp,socialPush,ordersPush,ordersWhatsapp])

  const handleSubmit = async () => {
    const orderData = {
      date: new Date(String(date)).toISOString(),
      timeSlot: String(time),
      guests: Number(guestCount),
      meal: String(selectedTab),
      offerId: offerId ?? null,
      username: updatedData?.name || String(name),
      email: String(email),
      mobileNumber: updatedData?.contact || String(contact),
    };
    console.log('📋 Original format order data:', orderData);
    try {
      const res = await api.post('/api/bookings/create', orderData, { params: { id: firmId } });
      console.log('✅ Order saved:', res.data);
      if (ordersPush) await UploadNotifications(orderData);
    } catch (error) {
      console.error('❌ Error saving order:', error?.response?.data || error?.message || String(error));
    }
  };



  const UploadNotifications = async (order) => {
    const { Rname, guests, timeSlot } = order;

    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    const uploadData = {
      title: "Table booked",
      description: `Your table is booked at ${Rname} on ${formattedDate} for ${guests} guests at ${timeSlot}`,
      time: formattedTime
    };

    try {
      const response = await axios.post(`${API_CONFIG.BACKEND_URL}/api/postNotificationsInfo`, uploadData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });


      // Only schedule notifications in development builds, not Expo Go
      if (!isExpoGo) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: uploadData.title,
            body: uploadData.description,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            seconds: 1,
          },
        });
      } else {
        console.log('📱 Notification would be shown:', uploadData.title, uploadData.description);
        Alert.alert(uploadData.title, uploadData.description);
      }
      console.log("✅ Notification saved:", response.data);
       router.push({
          pathname: '/screens/OrderSceess',
          params: {
            totalAmount: '50.00',
            restaurantName: firmName || 'Restaurant',
            autoRedirect: 'true'
          }
        });
    } catch (error) {
      console.log("❌ Error in uploading the notification", error.message);
    }
  };




  const router = new useRouter()
  return (
    // <View
    //   style={styles.container}
    // >

    //   <View
    //     style={styles.displayTab}
    //   >
    //     <Text
    //       style={styles.summaryType}
    //     >
    //       Restaurant
    //     </Text>
    //     <Text
    //       style={styles.summaryValue}
    //     >
    //       {firmName}
    //     </Text>
    //   </View>
    //   <View
    //     style={styles.displayTab}
    //   >
    //     <Text
    //       style={styles.summaryType}
    //     >
    //       Number of Guests
    //     </Text>
    //     <Text
    //       style={styles.summaryValue}
    //     >
    //       {guestCount}
    //     </Text>
    //   </View>
    //   <View
    //     style={styles.displayTab}
    //   >
    //     <Text
    //       style={styles.summaryType}
    //     >
    //       Date
    //     </Text>
    //     <Text
    //       style={styles.summaryValue}
    //     >
    //       {date}
    //     </Text>
    //   </View>
    //   <View
    //     style={[styles.displayTab, {marginBottom: 16}]}
    //   >
    //     <Text
    //       style={styles.summaryType}
    //     >
    //       Time
    //     </Text>
    //     <Text
    //       style={styles.summaryValue}
    //     >
    //       {time}
    //     </Text>
    //   </View>
    //   <TouchableOpacity
    //     style={styles.continueButton}
    //     onPress={handleSubmit}
    //   >
    //     <Text
    //       style={styles.buttonText}
    //     >
    //       Submit
    //     </Text>
    //   </TouchableOpacity>
    // </View>
    <Fragment>
      <ScrollView className="flex-1 bg- bg-[#E6F1F2]">
        <View className=" bg-[#E6F1F2] flex-row items-center mb-6 mt-2">
          <TouchableOpacity
            className="pr-4 mr-2"
            onPress={() => { router.back() }}
          >
            <Ionicons name='arrow-back' size={24} />
          </TouchableOpacity>
          <View className="bg-[#E6F1F2] ">
            <Text className="font-bold text-2xl text-textprimary mb-1">
              Booking Summary
            </Text>
          </View>
        </View>
        <View className="bg-[#E6F1F2] flex-1">
          <View className="p-4">
            <Text className="text-textsecondary text-center mb-1">
              Cover charge of ₹125 will be adjusted with your final
            </Text>
            <Text className="text-textsecondary text-center mb-4">
              Bill payment at the restaurant
            </Text>
          </View>
          <View className="bg-white mx-4 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={18} color="#525259" />
              <Text className="ml-3 text-textsecondary">{date} at {time}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <AntDesign name="addusergroup" size={18} color="#525259" />
              <Text className="ml-3 text-textsecondary">{guestCount} guests</Text>
            </View>
            <View className="flex-row items-start mb-3">
              <Ionicons name="location-outline" size={20} color="#525259" className="mt-2" />
              <View className="ml-3 flex-1">
                <Text className="text-textprimary font-medium">{firmName}</Text>
                <Text className="text-smalltext text-sm">{firmadd}</Text>
              </View>
            </View>
            <View className="flex-row items-start mb-3">
              <MaterialIcons name="local-offer" size={20} color="#525259" className="mt-2" />
              <View className="ml-3 flex-1">
                <Text className="text-textprimary font-medium">Flat {parsedOffer?.discountValue ?? 0}% OFF on total bill</Text>
                <Text className="text-smalltext text-sm">Pay bill between 6:15 PM - 12:15</Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center border-t pt-3">
              <View>
                <Text className="text-textprimary font-medium">Cover charge to be paid</Text>
                <Text className="text-smalltext text-sm">Cover charge: Flat {parsedOffer?.discountValue ?? 0}% OFF</Text>
              </View>
              <View className="items-end">
                <Text className="text-textprimary font-medium">₹125</Text>
                <Text className="text-smalltext text-sm">₹125</Text>
              </View>
            </View>
          </View>
          {reqeststate ?
            <View className="bg-white mx-4 rounded-lg p-4 mb-4 flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-textprimary font-medium">Special request</Text>
                <Text className="text-smalltext text-sm">{requestDataa.data}:{requestDataa.item}</Text>
              </View>
              <TouchableOpacity onPress={handleDelete}>
                <AntDesign name="delete" size={22} color="#2e7e5e" />
              </TouchableOpacity>
            </View> : <TouchableOpacity onPress={toggleRequestModal} className="bg-white mx-4 rounded-lg p-4 mb-4 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={26} color="black" />
                <Text className="ml-3 text-textprimary">Add special request</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="black" />
            </TouchableOpacity>}
          <Modal
            visible={RequestModal}
            onRequestClose={() => setRequestModal(false)}
            animationType="slide"
            transparent={true}
          >
            <AddRequest toggle={toggleRequestModal} data={handleRequestData} />
          </Modal>
          <View className="flex-row items-center mx-4 my-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-smalltext text-sm font-medium">RESTAURANT TERMS</Text>
            <View className="flex-1 h-px bg-border" />
          </View>
          <View className="bg-white mx-4 rounded-lg p-4 mb-4">
            <View className="flex-row items-center">
              <FontAwesome name="circle" size={8} color="black" className="ml-2" />
              <Text className="ml-3 text-textsecondary">No offers allowed for stag entries</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <FontAwesome name="circle" size={8} color="black" className="ml-2" />
              <Text className="ml-3 text-textsecondary">Stag entry as per restaurant policy</Text>
            </View>
          </View>
          <View className="flex-row items-center mx-4 my-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-smalltext text-sm font-medium">YOUR DETAILS</Text>
            <View className="flex-1 h-px bg-border" />
          </View>
          <View className="bg-white mx-4 rounded-lg p-4 mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-textprimary font-medium">
                {updatedData?.name || name}
              </Text>
              <Text className="text-smalltext text-sm">
                {updatedData?.contact || contact}
              </Text>
            </View>
            <TouchableOpacity onPress={toggleInputModal}>
              <Text className="text-textprimary font-medium">Edit</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={inputModal}
            onRequestClose={toggleInputModal}
          >
            <InputModalEdit name2={updatedData ? updatedData.name : name} contact2={updatedData ? updatedData.contact : contact} update={handleUpdated} toggle={toggleInputModal} />
          </Modal>
          <View className="p-16"></View>
        </View>

      </ScrollView>
      <View className="bg-white border-t border-border p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-textprimary font-medium">Amazon Pay</Text>
          <Text className="text-smalltext">Balance: ₹5</Text>
        </View>
        <TouchableOpacity className="bg-primary rounded-lg p-4 flex-row justify-between items-center" onPress={handleSubmit}>
          <View>
            <Text className="text-white font-bold text-lg">₹50.00</Text>
            <Text className="text-white text-sm">TOTAL</Text>
          </View>
          <View className="flex-row items-center mr-2">
            <Text className="text-white font-medium mr-1">Pay Bill</Text>
            <Ionicons name="caret-forward-outline" size={18} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </Fragment>
  )
}