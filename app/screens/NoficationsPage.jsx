import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";
import { API_CONFIG } from '../../config/apiConfig';

const { width } = Dimensions.get("window");

const NotificationItem = ({ notification, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -101) {
        Animated.timing(translateX, {
          toValue: -80,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 10,
      useNativeDriver: true,
    }).start(() => onDelete());
  };

  return (
    <View className="overflow-hidden my-2 rounded-lg bg-white shadow-sm">
      <View className="absolute right-0 w-20 h-full bg-primary justify-center items-center rounded-lg">
        <TouchableOpacity onPress={handleDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View
        className="flex-row items-center py-4 px-4 bg-white"
        {...panResponder.panHandlers}
      >
        <MaterialCommunityIcons
          name="cart-check"
          size={20}
          color="#e23744"
          className="mr-3"
        />
        <View className="flex-1">
          <Text className="text-textprimary font-outfit-bold text-base mb-1">{notification.title}</Text>
          <Text className="text-textsecondary font-outfit text-sm leading-5">{notification.description}</Text>
        </View>
        <Text className="text-textsecondary font-outfit text-xs ml-3 self-start">{notification.time}</Text>
      </Animated.View>
    </View>
  );
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const { safeNavigation } = useSafeNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: "Notifications" });
  }, [navigation]);

  const fetchBookingNotifications = async () => {
    try {

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/api/getNotificationsInfo`, {
        withCredentials: true,
      });
      const data = response?.data?.notifications;
      console.log("data", data);
      if (Array.isArray(data)) {
        setNotifications([...data].reverse());
      } else if (data) {
        setNotifications([data]);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.log("Error in fetching notifications", error);
      setNotifications([]);
    }
  };

  const handleDeleteNotifications = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BACKEND_URL}/api/deleteNotificatonsInfo/${id}`, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      console.log("Notification deleted successfully", id);
    } catch (error) {
      console.log("Error in deleting notifications", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const deletePromises = notifications.map((item) =>
        axios.delete(`${API_CONFIG.BACKEND_URL}/api/deleteNotificatonsInfo/${item._id}`, {
          withCredentials: true,
        })
      );
      await Promise.all(deletePromises);
      setNotifications([]);
      console.log("✅ All notifications cleared");
    } catch (error) {
      console.error("❌ Error clearing all notifications", error);
    }
  };

  useEffect(() => {
    fetchBookingNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <NotificationItem
      key={item._id}
      notification={item}
      onDelete={() => handleDeleteNotifications(item._id)}
    />
  );

  return (
    <View className="flex-1 bg-white px-4">
      <BackRouting tittle="Notifications" />
      

      {Array.isArray(notifications) && notifications.length > 0 ? (
        <View>
          <View className="flex-row justify-end mr-5 mt-2">
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text className="text-primary font-outfit-bold">Clear All</Text>
        </TouchableOpacity>
      </View>
          <FlatList
          data={notifications}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        </View>
      ) : (
        <TouchableOpacity
          // onPress={() => safeNavigation("/screens/DiningBookingDetails")}
          className="flex-1 justify-center items-center"
        >
          <Text className="text-textprimary text-xl font-outfit-bold">
            No Notifications found
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  itemContainer: {
    overflow: "hidden",
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  icon: { marginRight: 12 },
  content: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    width: 80,
    height: "101%",
    backgroundColor: "#e23744",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
