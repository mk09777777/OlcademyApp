import { useState, useCallback } from 'react';
import { tiffinApi } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tiffinApi.getOrders();
      
      // Categorize orders
      const active = data.filter(order => 
        ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
      );
      const past = data.filter(order => 
        ['delivered', 'cancelled'].includes(order.status)
      );

      setOrders(data);
      setActiveOrders(active);
      setPastOrders(past);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      const newOrder = await tiffinApi.createOrder(orderData);
      
      // Update orders lists
      setOrders(prev => [newOrder, ...prev]);
      setActiveOrders(prev => [newOrder, ...prev]);
      
      setError(null);
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      const updatedOrder = await tiffinApi.updateOrder(orderId, { status });
      
      // Update orders lists
      setOrders(prev => 
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );

      if (['delivered', 'cancelled'].includes(status)) {
        setActiveOrders(prev => prev.filter(order => order.id !== orderId));
        setPastOrders(prev => [updatedOrder, ...prev]);
      } else {
        setActiveOrders(prev => 
          prev.map(order => order.id === orderId ? updatedOrder : order)
        );
      }
      
      setError(null);
      return updatedOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const cancelledOrder = await tiffinApi.updateOrder(orderId, { status: 'cancelled' });
      
      // Update orders lists
      setOrders(prev => 
        prev.map(order => order.id === orderId ? cancelledOrder : order)
      );
      setActiveOrders(prev => prev.filter(order => order.id !== orderId));
      setPastOrders(prev => [cancelledOrder, ...prev]);
      
      setError(null);
      return cancelledOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    activeOrders,
    pastOrders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
  };
}; 