import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @deprecated
 * This Orders context appears unused by current routes/providers and overlaps with `hooks/useOrders.js`.
 * Kept for compatibility. Prefer clarifying a single Orders source of truth before adding new usages.
 */

const OrdersContext = createContext(null);

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from storage on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem('orders');
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };
    loadOrders();
  }, []);

  // Save orders to storage whenever they change
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    };
    saveOrders();
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (orderId, updateData) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, ...updateData } : order
    ));
  };

  const cancelOrder = (orderId) => {
    updateOrder(orderId, { status: 'cancelled' });
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrder,
        cancelOrder,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export default OrdersProvider;
export { useOrders }; 