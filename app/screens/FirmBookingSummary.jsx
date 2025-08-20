import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { styles } from '@/styles/FirmBookingStyles'
import { Ionicons } from '@expo/vector-icons'
import BookingSummaryStyles from "../../styles/bookinsummary"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddRequest from '../../components/AddRequest'
import InputModalEdit from '../../components/updateNameModal';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
      const response = await fetch('http://192.168.0.102:3000/api/getnotifications', {
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
      date: date,
      timeSlot: time,
      guests: guestCount,
      meal: selectedTab,
      offerId: offerId,
      username: updatedData?.name || name,
      email: email,
      mobileNumber: updatedData?.contact || contact,
    };

    try {
      const response = await axios.post(
        `http://192.168.0.102:3000/api/bookings/create?id=${firmId}`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Order saved:", response.data);
      {ordersPush?UploadNotifications(orderData):<></>}
      router.push('/screens/DiningBooking')
      // Alert.alert("Order Saved Successfully");
    } catch (error) {
      console.error("❌ Error saving order:", error.response?.data || error.message);
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
      const response = await axios.post("http://192.168.0.102:3000/api/postNotificationsInfo", uploadData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: uploadData.title,
          body: uploadData.description,
          sound: true, // even if disabled, sometimes helps on Android
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: 1,
        },
      });
      console.log("✅ Notification saved:", response.data);
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
      <ScrollView>
        <View
          style={styles.upperPannel}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { router.back() }}
          >
            <Ionicons name='arrow-back' size={24} />
          </TouchableOpacity>
          <View>
            <Text
              style={styles.pageHeader}
            >
              Booking Summary
            </Text>
          </View>
        </View>
        <View style={BookingSummaryStyles.background}>
          <View style={BookingSummaryStyles.headerContainer}>
            <Text style={BookingSummaryStyles.headingText}>
              Cover charge of ₹125 will be adjusted with your final
            </Text>
            <Text style={BookingSummaryStyles.headingText}>
              Bill payment at the restaurant
            </Text>
          </View>
          <View style={BookingSummaryStyles.BillingDetailContainer}>
            <View style={BookingSummaryStyles.summary1Container}>
              <Feather name="calendar" size={18} color="#525259" />
              <Text style={BookingSummaryStyles.Text1}>{date} at {time}</Text>
            </View>
            <View style={BookingSummaryStyles.summary3Container}>
              <AntDesign name="addusergroup" size={18} color="#525259" />
              <Text style={BookingSummaryStyles.Text1}>{guestCount} guests</Text>
            </View>
            <View style={BookingSummaryStyles.summary2Container}>
              <Ionicons name="location-outline" size={20} color="#525259" style={{ marginTop: 9 }} />
              <View style={BookingSummaryStyles.TextAddContainer}>
                <Text style={BookingSummaryStyles.TextAdd1}>{firmName}</Text>
                <Text style={BookingSummaryStyles.TextAdd2}>{firmadd}</Text>
              </View>
            </View>
            <View style={BookingSummaryStyles.summary2Container}>
              <MaterialIcons name="local-offer" size={20} color="#525259" style={{ marginTop: 9 }} />
              <View style={BookingSummaryStyles.TextAddContainer}>
                <Text style={BookingSummaryStyles.TextAdd1}>Flat {parsedOffer?.discountValue ?? 0}% OFF on total bill</Text>
                <Text style={BookingSummaryStyles.TextAdd2}>Pay bill between 6:15 PM - 12:15 </Text>
              </View>
            </View>
            <View style={BookingSummaryStyles.summary4Container}>
              <View style={BookingSummaryStyles.TextAddContainer}>
                <Text style={BookingSummaryStyles.TextAdd11}>Cover charge to be paid</Text>
                <Text style={BookingSummaryStyles.TextAdd21}> Cover charge: Flat {parsedOffer?.discountValue ?? 0}% OFF</Text>
              </View>
              <View style={BookingSummaryStyles.TextAddContainer}>
                <Text style={BookingSummaryStyles.TextAdd11}>₹125</Text>
                <Text style={BookingSummaryStyles.TextAdd21}>₹125</Text>
              </View>
            </View>
          </View>
          {reqeststate ?
            <View style={BookingSummaryStyles.addrequestContainer}>
              <View style={BookingSummaryStyles.addrequestStartActive}>

                <Text style={BookingSummaryStyles.requestText}>Special request</Text>
                <Text style={BookingSummaryStyles.requestText2}>{requestDataa.data}:{requestDataa.item}</Text>
              </View>
              <TouchableOpacity onPress={handleDelete}>
                <AntDesign name="delete" size={22} color="#2e7e5e" />
              </TouchableOpacity>
            </View> : <TouchableOpacity onPress={toggleRequestModal} style={BookingSummaryStyles.addrequestContainer}>
              <View style={BookingSummaryStyles.addrequestStart}>
                <Ionicons name="add-circle-outline" size={26} color="black" />
                <Text style={BookingSummaryStyles.requestText}>Add special request</Text>
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
          <View style={BookingSummaryStyles.Divider}>
            <View style={BookingSummaryStyles.line} />
            <Text style={BookingSummaryStyles.SeperateText}>RESTAURANT TERMS</Text>
            <View style={BookingSummaryStyles.line} />
          </View>
          <View style={BookingSummaryStyles.TermsContainer}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="circle" size={8} color="black" style={{ marginLeft: 10 }} />
              <Text style={BookingSummaryStyles.TermsText}>No offers allowed for stag entries</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <FontAwesome name="circle" size={8} color="black" style={{ marginLeft: 10 }} />
              <Text style={BookingSummaryStyles.TermsText}>Stag entry as per restaurant policy</Text>
            </View>
          </View>
          <View style={BookingSummaryStyles.Divider}>
            <View style={BookingSummaryStyles.line} />
            <Text style={BookingSummaryStyles.SeperateText}>YOUR DETAILS</Text>
            <View style={BookingSummaryStyles.line} />
          </View>
          <View style={BookingSummaryStyles.DetailsContainer}>
            <View style={BookingSummaryStyles.TextAddContainer}>
              <Text style={BookingSummaryStyles.TextAdd1}>
                {updatedData?.name || name}
              </Text>
              <Text style={BookingSummaryStyles.EditText2}>
                {updatedData?.contact || contact}
              </Text>
            </View>
            <TouchableOpacity onPress={toggleInputModal}>
              <Text style={BookingSummaryStyles.EditText}>Edit</Text>
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
          <View style={{ padding: 60 }}></View>
        </View>

      </ScrollView>
      <View style={BookingSummaryStyles.payContainer}>
        <View style={BookingSummaryStyles.paymentDetailsContainer}>
          <Text style={BookingSummaryStyles.payText1}>Amazon Pay</Text>
          <Text style={BookingSummaryStyles.payText2}>Balance: ₹5</Text>
        </View>
        <View style={BookingSummaryStyles.PayButton}>

          <TouchableOpacity style={BookingSummaryStyles.PayButton} onPress={handleSubmit}>
            <View style={BookingSummaryStyles.paymentDetailsContainer}>
              <Text style={BookingSummaryStyles.payText3}>₹50.00</Text>
              <Text style={BookingSummaryStyles.payText32}>TOTAL</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", marginRight: 6, alignItems: "center" }}>
              <Text style={BookingSummaryStyles.payText4}>Pay Bill </Text>
              <Ionicons name="caret-forward-outline" size={18} color="white" />
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </Fragment>
  )
}