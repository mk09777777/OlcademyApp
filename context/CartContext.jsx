import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter } from 'react-native';
import { API_CONFIG } from '../config/apiConfig';
import EventEmitter from 'eventemitter3';
const cartEventEmitter = new EventEmitter();

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
    const [carts, setCarts] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [taxDetails, setTaxDetails] = useState([]);
  const [gstAmount, setGstAmount] = useState([])
  const [deliveryFee, setDeliveryFee] = useState(15);
  const [platformFee, setPlatformFee] = useState(10);
  const [restaurantInfo, setRestaurantInfo] = useState({
    id: '',
    name: '',
    address: '',
    image: ''
  });

  const lastFetchRef = useRef(0);

  const api = useMemo(() => {
    const instance = axios.create({
      
      baseURL: `${API_CONFIG.BACKEND_URL}/api`,
      withCredentials: true,
      timeout: 5000,
    });

    instance.interceptors.request.use(config => {
      console.log('Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    }, error => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    });

    instance.interceptors.response.use(response => {
      console.log('Response:', response.data);
      return response;
    }, error => {
      if (error.response) {
        console.error('Response Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No Response Received:', error.request);
      } else {
        console.error('Request Setup Error:', error.message);
      }
      return Promise.reject(error);
    });

    return instance;
  }, []);

  const validateCartItem = (item) => {
    if (!item || typeof item !== 'object') return false;
    return (
      item.productId &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      item.sourceEntityId &&
      item.sourceEntityName
    );
  };

  const fetchCart = useCallback(async () => {
    const now = Date.now();
    if (loading || (now - lastFetchRef.current < 2000)) return;

    try {
      lastFetchRef.current = now;
      setLoading(true);
      const response = await api.get('/cart');

      if (response.data) {
        const cartItems = response.data.items?.reduce((acc, item) => {
          acc[item.productId] = {
            ...item,
            _id: item.productId,
            productName: item.name
          };
          return acc;
        }, {}) || {};
console.log('caet',response.data)
        setCart(cartItems);
        setCarts(response.data);
        setCartCount(response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);

        if (response.data.taxDetails) {
          setTaxDetails(response.data.taxDetails);
        }
        if (response.data.gstCharges) {
          setGstAmount(response.data.gstCharges);
        }
        if (response.data.deliveryFee !== undefined) {
          setDeliveryFee(response.data.deliveryFee);
        }

        if (response.data.platformFee !== undefined) {
          setPlatformFee(response.data.platformFee);
        }

        if (response.data.items?.length > 0) {
          const firstItem = response.data.items[0];
          setRestaurantInfo({
            id: firstItem?.restaurantName?._id || firstItem?.sourceEntityId?._id || '',
          });
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [api, loading]);

  const calculateCartCount = useCallback(async () => {
    try {
      const response = await api.get('/count');
      if (response.data?.count >= 0) {
        setCartCount(response.data.count);
      }
    } catch (error) {
      console.error("Error calculating cart count:", error);
      setError(error);
    }
  }, [api]);

  const addToCart = useCallback(async (itemToAdd) => {
    try {
      setLoading(true);
      setError(null);

      // Optimistic update
      const productId = itemToAdd.productId;
      setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[productId]) {
          newCart[productId] = {
            ...newCart[productId],
            quantity: newCart[productId].quantity + 1
          };
        } else {
          newCart[productId] = { ...itemToAdd, quantity: 1 };
        }
        return newCart;
      });

      setCartCount(prev => prev + 1);

      // API call - only send the item being added
      await api.post('/cart', itemToAdd);

    } catch (error) {
      // Rollback on error
      setCart(prevCart => {
        const newCart = { ...prevCart };
        delete newCart[itemToAdd.productId];
        return newCart;
      });
      setCartCount(prev => prev - 1);

      console.error("Error adding item to cart:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateCartAndNotify = useCallback(async (updatedCart) => {
    try {
      setLoading(true);
      const cartItemsArray = Object.values(updatedCart);
      const response = await api.put('/cart', { items: cartItemsArray });

      if (response.data) {
        // Only update what changed
        setCart(prevCart => {
          const newCart = { ...prevCart };
          response.data.items?.forEach(item => {
            newCart[item.productId] = item;
          });
          return newCart;
        });

        // Update other states if they changed
        if (response.data.taxDetails) setTaxDetails(response.data.taxDetails);
        if (response.data.deliveryFee !== undefined) setDeliveryFee(response.data.deliveryFee);
        if (response.data.platformFee !== undefined) setPlatformFee(response.data.platformFee);

        cartEventEmitter.emit('cartUpdate', {
          cart: updatedCart,
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const handleRemove = useCallback((itemId) => {
    const updatedCart = { ...cart };
    delete updatedCart[itemId];
    updateCartAndNotify(updatedCart);
  }, [cart, updateCartAndNotify]);

  const handleQuantityChange = useCallback(async (itemId, delta) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (!updatedCart[itemId]) return prevCart;

      const newQuantity = updatedCart[itemId].quantity + delta;

      if (newQuantity > 0) {
        updatedCart[itemId] = {
          ...updatedCart[itemId],
          quantity: newQuantity
        };
      } else {
        delete updatedCart[itemId];
      }

      // Optimistic update
      setCartCount(prev => prev + delta);

      // Async update - don't wait for it
      updateCartAndNotify(updatedCart).catch(error => {
        // Auto-rollback if the update fails
        setCart(prevCart);
        setCartCount(prev => prev - delta);
      });

      return updatedCart;
    });
  }, [updateCartAndNotify]);

  const getCartItems = useCallback(() => {
    return Object.values(cart).filter(validateCartItem);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }, [getCartItems]);

  const getSubtotal = useCallback(() => {
    return getCartItems().reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ).toFixed(2);
  }, [getCartItems]);

  const getDiscount = useCallback(() => {
    const discount = getCartItems().reduce((sum, item) => {
      return sum + (item.discount || 0) * item.quantity;
    }, 0);
    return discount.toFixed(2);
  }, [getCartItems]);

  const getTotal = useCallback(() => {
    const subtotal = parseFloat(getSubtotal());
    const discount = parseFloat(getDiscount());
    const gst = taxDetails.reduce((sum, tax) => sum + (tax.gstAmount || 0), 0);
    return (subtotal - discount + gst + deliveryFee + platformFee).toFixed(2);
  }, [getSubtotal, getDiscount, taxDetails, deliveryFee, platformFee]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      platformFee: 0,
      gstCharges: 0,
      totalPrice: 0,
    })
    try {
      api.get('/cart/clear');
    } catch (error) {
      console.error("Error clearing cart on backend:", error);
    }
  }, []);

  const contextValue = useMemo(() => ({
    cart,
    carts,
    cartCount,
    loading,
    error,
    initialLoad,
    taxDetails,
    deliveryFee,
    platformFee,
    restaurantInfo,
    handleRemove,
    handleQuantityChange,
    addToCart,
    getCartItems,
    getTotalItems,
    getSubtotal,
    getDiscount,
    gstAmount,
    getTotal,
    fetchCart,
    calculateCartCount,
    clearCart
  }), [
    cart,
    carts,
    cartCount,
    loading,
    error,
    initialLoad,
    taxDetails,
    deliveryFee,
    platformFee,
    restaurantInfo,
    handleRemove,
    handleQuantityChange,
    addToCart,
    getCartItems,
    getTotalItems,
    getSubtotal,
    getDiscount,
    gstAmount,
    getTotal,
    fetchCart,
    calculateCartCount,
    clearCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };