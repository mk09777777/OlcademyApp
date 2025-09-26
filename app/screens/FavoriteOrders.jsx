import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity,Image } from 'react-native';
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import TakeawayOrderCard from '../../Card/TakewayCard';
import TiffinOrderCard from '../../components/TiffinOrderCard';

import { API_CONFIG } from '../../config/apiConfig';
import BackRouting from '@/components/BackRouting';
const SERVER_URL = API_CONFIG.BACKEND_URL;
export default function FavoriteOrdersScreen() {
  const [activeTab, setActiveTab] = useState('Takeaway');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
   const [showOrderModal, setShowOrderModal] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (page, type) => {
    if (!hasMore && page !== 1) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orderFav?page=${page}&limit=10&type=${type}`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage } = response.data;
      
      if (page === 1) {
        setOrders(fetchedOrders);
      } else {
        setOrders(prev => [...prev, ...fetchedOrders]);
      }
      
      setTotalPages(fetchedTotalPages);
      setCurrentPage(fetchedCurrentPage);
      setHasMore(fetchedCurrentPage < fetchedTotalPages);
    } catch (error) {
      console.error('Error fetching favorite orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch favorite orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hasMore]);

  useEffect(() => {
    fetchOrders(1, activeTab === 'Takeaway' ? 'Firm' : 'Tiffin');
  }, [fetchOrders, activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(1, activeTab === 'Takeaway' ? 'Firm' : 'Tiffin');
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchOrders(currentPage + 1, activeTab === 'Takeaway' ? 'Firm' : 'Tiffin');
    }
  };

  const toggleFavorite = async (orderId) => {
    try {
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, fav: !order.fav } : order
      );
      setOrders(updatedOrders);

      await axios.put(
        `${SERVER_URL}/api/orderFav/${orderId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert if error
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, fav: !order.fav } : order
      ));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
      case 'completed':
        return '#054935ff';
      case 'payment failed':
      case 'rejected':
      case 'cancelled':
      case 'user_cancel':
        return '#e23744';
      case 'on the way':
        return '#fc8019';
      case 'preparing':
      case 'pending':
        return '#f57c00';
      case 'accept':
        return '#0f8a65';
      default:
        return '#333';
    }
  };

const prepareOrderData = (order) => {
  if (activeTab === 'Takeaway') {
    const restaurantInfo = order.items?.[0]?.sourceEntityId?.restaurantInfo || {};
    return {
      ...order,
      restaurantname: restaurantInfo.name || 'Restaurant',
      location: restaurantInfo.address || 'Location not specified',
      image: order.items?.[0]?.sourceEntityId?.image_url || require('../../assets/images/food.jpg'), // Changed 'item' to 'order'
      orderDate: order.orderTime ? new Date(order.orderTime).toLocaleDateString() : new Date().toLocaleDateString(),
      status: order.status || 'Unknown',
      amount: order.totalPrice || 0,
      items: order.items?.map(item => ({
        ...item,
        veg: item.veg || false, 
        quantity: item.quantity || 1,
        price: item.price || 0
      })) || [],
      fav: order.fav || false
    };
  } else {
    // For Tiffin orders
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};
    return {
      ...order,
      restaurantname: firstItem.sourceEntityId?.kitchenName || firstItem.name || "Unknown Tiffin Service",
      location: order.address || "Location not specified",
      image: firstItem.img || "https://placehold.co/150x150/e0f2f7/00796b?text=Tiffin",
      orderDate: order.orderTime ? formatDate(order.orderTime) : formatDate(new Date()),
      orderTime: order.orderTime ? formatTime(order.orderTime) : formatTime(new Date()),
      status: order.status || 'Unknown',
      amount: order.totalPrice || 0,
      items: order.items || [],
      fav: order.fav || false
    };
  }
};
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderDetails = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };
  const calculateProgress = (order) => {
    const totalDaysInPlan = parseInt(order.items?.[0]?.selectedPlan?.name, 10) || 0;
    if (totalDaysInPlan <= 0) {
      return { progress: 0, deliveredDays: 0 };
    }

    const start = new Date(order.items[0].startDate);
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveredCount = order.subStatus?.filter(s => {
      const deliveryDate = new Date(s.date);
      deliveryDate.setHours(0, 0, 0, 0);
      return s.statue === "delivered" && deliveryDate >= start && deliveryDate <= today;
    }).length || 0;

    let progress = (deliveredCount / totalDaysInPlan) * 100;
    progress = Math.min(100, Math.max(0, progress));

    return {
      progress: progress,
      deliveredDays: deliveredCount,
      totalDays: totalDaysInPlan,
      daysRemaining: Math.max(0, totalDaysInPlan - deliveredCount)
    };
  };
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#FF002E" />
      </View>
    );
  };

  const renderError = () => (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-primary text-center font-outfit mb-4">{error}</Text>
      <TouchableOpacity 
        className="bg-primary px-6 py-3 rounded-lg" 
        onPress={() => fetchOrders(1, activeTab === 'Takeaway' ? 'Firm' : 'Tiffin')}
      >
        <Text className="text-white font-outfit-bold">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const orderData = prepareOrderData(item);
    
    return activeTab === 'Takeaway' ? (
      <TakeawayOrderCard 
        order={orderData} 
        onToggleFavorite={() => toggleFavorite(item._id)}
      />
    ) : (
      <TiffinOrderCard
        item={orderData}
        formatDate={formatDate}
        formatTime={formatTime}
        getStatusColor={getStatusColor}
        onToggleFavorite={() => toggleFavorite(item._id)}
        selectedOrder={selectedOrder}
      showOrderModal={showOrderModal}
      closeOrderDetails={closeOrderDetails}
      calculateProgress={calculateProgress}
      onPress={() => openOrderDetails(item)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackRouting tittle ="Favorite Orders"/>
      {/* Tabs */}
      <View className="px-5 py-3">
        <View 
          style={{
            backgroundColor: '#feebee',
            borderRadius: 30,
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          {/* Active Tab Indicator */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: activeTab === 'Takeaway' ? 0 : '50%',
              width: '50%',
              height: '100%',
              backgroundColor: '#FF002E',
              borderRadius: 30,
            }}
          />
          
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 30,
            }}
            onPress={() => setActiveTab('Takeaway')}
          >
            <Ionicons 
              name="fast-food" 
              size={20} 
              color={activeTab === 'Takeaway' ? '#FFFFFF' : '#FF002E'} 
              style={{ marginRight: 8 }}
            />
            <Text 
              style={{
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'outfit-medium',
                color: activeTab === 'Takeaway' ? '#FFFFFF' : '#FF002E',
              }}
            >
              Takeaway
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 30,
            }}
            onPress={() => setActiveTab('Tiffin')}
          >
            <MaterialCommunityIcons 
              name="food-takeout-box" 
              size={20} 
              color={activeTab === 'Tiffin' ? '#FFFFFF' : '#FF002E'} 
              style={{ marginRight: 8 }}
            />
            <Text 
              style={{
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'outfit-medium',
                color: activeTab === 'Tiffin' ? '#FFFFFF' : '#FF002E',
              }}
            >
              Tiffin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Display */}
      {error && renderError()}

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF002E" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            !error && (
              <View className="flex-1 items-center justify-center py-12">
                <Image 
                  source={require('../../assets/images/logo.jpg')} 
                  className="w-24 h-24 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-textsecondary text-center font-outfit">No favorite {activeTab.toLowerCase()} orders found</Text>
              </View>
            )
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}