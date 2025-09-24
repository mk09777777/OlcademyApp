import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TakeawayOrderCard from '../../Card/TakewayCard';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

const SERVER_URL = API_CONFIG.BACKEND_URL;

export default function TakeawayOrdersScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (page, tab = activeTab) => {
    if (!hasMore && page !== 1) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/orders/takeaway/user?page=${page}&limit=10`,
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
      console.error('Error fetching takeaway orders:', error);
      const message = error.response?.status === 404
        ? 'Takeaway orders endpoint not found. Please check the server configuration.'
        : error.response?.data?.message || 'Failed to fetch orders. Please try again.';
      setError(message);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hasMore, activeTab]);

  useEffect(() => {
    fetchOrders(1);
  }, [activeTab, fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchOrders(currentPage + 1);
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
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, fav: !order.fav } : order
      ));
    }
  };

  const handleOrderCancelled = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: "user_cancel" } : order
      )
    );
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    if (activeTab === 'active') {
      filtered = filtered.filter(order =>
        ['ready', 'accepted', 'preparing'].includes(order.status.toLowerCase())
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(order =>
        ['completed', 'delivered', 'cancelled', 'rejected', 'user_cancel'].includes(order.status.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(order => {
        const restaurantName = order.items[0]?.sourceEntityId?.restaurantInfo?.name || '';
        return (
          restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    return filtered;
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#fc8019" />
        <Text style={styles.footerText}>Loading more orders...</Text>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchOrders(1)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderItem = ({ item }) => {
    const restaurantInfo = item.items?.[0]?.sourceEntityId?.restaurantInfo || {};
    const safeItem = {
      ...item,
      amount: item.totalPrice || 0,
      subtotal: item.subtotal || 0,
      deliveryFee: item.deliveryFee || 0,
      platformFee: item.platformFee || 0,
      gstCharges: item.gstCharges || 0,
      discount: item.discount || 0,
      items: item.items?.map(i => ({
        ...i,
        price: i.price || 0,
        quantity: i.quantity || 1,
        veg: i.foodType === 'veg',
      })) || [],
      image: item.items?.[0]?.sourceEntityId?.image_url || require('../../assets/images/food.jpg'),
      location: restaurantInfo.address || 'Location not specified',
      restaurantname: restaurantInfo.name || 'Restaurant',
      firmId: item.items?.[0]?.sourceEntityId?._id,
      status: item.status || 'Unknown',
      orderDate: item.orderTime || '',
      orderTime: item.orderTime || '',
      deliverTime: item.deliverTime || '',
    };

    return (
      <TakeawayOrderCard
        order={safeItem}
        onToggleFavorite={() => toggleFavorite(item._id)}
        onOrderCancelled={() => handleOrderCancelled(item._id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' ? styles.activeTab : null]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' ? styles.activeTabText : null]}>
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' ? styles.activeTab : null]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' ? styles.activeTabText : null]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' ? styles.activeTab : null]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' ? styles.activeTabText : null]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && renderError()}

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF002E" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            !error && (
              <View style={styles.emptyContainer}>
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyText}>
                  {activeTab === 'all'
                    ? 'No orders found'
                    : activeTab === 'active'
                      ? 'No active orders'
                      : 'No past orders'}
                </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'outfit',
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF002E',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'outfit',
  },
  activeTabText: {
    color: '#FF002E',
    fontFamily: 'outfit-bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'outfit',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fee2e2',
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#b91c1c',
    fontFamily: 'outfit-bold',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#FF002E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'outfit-bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'outfit',
    textAlign: 'center',
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'outfit',
  },
});