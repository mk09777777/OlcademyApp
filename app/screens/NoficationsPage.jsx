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
    <View style={styles.itemContainer}>
      <View style={styles.deleteButton}>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.notificationContainer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <MaterialCommunityIcons
          name="cart-check"
          size={20}
          color="#e23744"
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.description}</Text>
        </View>
        <Text style={styles.time}>{notification.time}</Text>
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
      const response = await axios.get("http://192.168.0.101:3000/api/getNotificationsInfo", {
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
      await axios.delete(`http://192.168.0.101:3000/api/deleteNotificatonsInfo/${id}`, {
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
        axios.delete(`http://192.168.0.101:3000/api/deleteNotificatonsInfo/${item._id}`, {
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
    <View style={styles.container}>
      <BackRouting tittle="Notifications" />
      

      {Array.isArray(notifications) && notifications.length > 0 ? (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginRight: 20, marginTop: 10 }}>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text style={{ color: "#f04f5f", fontWeight: "bold" }}>Clear All</Text>
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
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
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
