import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function BookingNotifications() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const notificationMapRef = useRef(new Map());

  const fetchDiningBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.0.101:3000/api/bookings/userId", {
        withCredentials: true,
      });
      const bookingsArray = response.data?.data || [];
      setUserBookings(bookingsArray);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    } finally {
      setLoading(false);
    }
  };
 const saveNotifiedBookings = async () => {
    try {
      const obj = Object.fromEntries(notificationMapRef.current);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (error) {
      console.error("Failed to save notifications", error.message);
    }
  };


  const uploadNotification = async (booking) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const uploadData = {
      title: "Table Confirmed",
      description: `Your table is booked at ${booking.Rname} on ${formattedDate} for ${booking.guests} guests at ${booking.timeSlot}`,
      time: formattedTime,
    };

    try {
      const response = await axios.post("http://192.168.0.101:3000/api/postNotificationsInfo", uploadData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const notificationId = response?.data?.notifications?._id || Date.now().toString();

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

      notificationMapRef.current.set(booking._id, notificationId);
      await saveNotifiedBookings();
      console.log(`✅ Notification set for booking ${booking._id} with ID ${notificationId}`);
    } catch (error) {
      console.error("❌ Error scheduling notification:", error.message);
    }
  };
  useEffect(() => {
    fetchDiningBookings();
  }, []);

  useEffect(() => {
    if (Array.isArray(userBookings)) {
      userBookings.forEach((booking) => {
        const alreadySent = notificationMapRef.current.has(booking._id);
        if (booking.status === "accepted" && !alreadySent) {
          uploadNotification(booking);
        }
      });
    }
  }, [userBookings]);

  return null;
}
