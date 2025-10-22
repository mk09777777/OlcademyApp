import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Switch, Modal, TouchableOpacity, ToastAndroid, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import NotificationModal from '../../components/NotificationModal';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { API_CONFIG } from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from "@/components/BackRouting";
import { useSafeNavigation } from "@/hooks/navigationPage";

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function NotificationSettings() {
    const [enableAll, setEnableAll] = useState(false);
    const [promosPush, setPromosPush] = useState(false);
    const [promosWhatsapp, setPromosWhatsapp] = useState(false);
    const [socialPush, setSocialPush] = useState(false);
    const [ordersPush, setOrdersPush] = useState(false);
    const [ordersWhatsapp, setOrdersWhatsapp] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);
    const [notificationmodal, setNotificationModal] = useState(false);
    const { safeNavigation } = useSafeNavigation();
    
    const initialState = useRef({
        enableAll: false,
        promosPush: false,
        promosWhatsapp: false,
        socialPush: false,
        ordersPush: false,
        ordersWhatsapp: false,
    });

    useEffect(() => {
        checkNotificationPermission();
        fetchInitialSettings();
    }, []);

    const checkNotificationPermission = async () => {
        try {
            if (isExpoGo) {
                console.log('📱 Running in Expo Go - notifications limited');
                await AsyncStorage.setItem('notification_permission', 'limited');
                setNotificationModal(false);
                return;
            }
            
            const { status } = await Notifications.getPermissionsAsync();
            if (status === 'granted') {
                await AsyncStorage.setItem('notification_permission', 'granted');
                setNotificationModal(false);
            } else {
                setNotificationModal(true);
            }
        } catch (error) {
            console.error('Error checking notification permission:', error);
        }
    };

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

    useEffect(() => {
        const hasChanged =
            enableAll !== initialState.current.enableAll ||
            promosPush !== initialState.current.promosPush ||
            promosWhatsapp !== initialState.current.promosWhatsapp ||
            socialPush !== initialState.current.socialPush ||
            ordersPush !== initialState.current.ordersPush ||
            ordersWhatsapp !== initialState.current.ordersWhatsapp;

        setButtonActive(hasChanged);
    }, [enableAll, promosPush, promosWhatsapp, socialPush, ordersPush, ordersWhatsapp]);

    const onToggleEnableAll = (value) => {
        setEnableAll(value);
        if (value) {
            setPromosPush(true);
            setPromosWhatsapp(true);
            setSocialPush(true);
            setOrdersPush(true);
            setOrdersWhatsapp(true);
        }
    };

    const submitNotificationSettings = async () => {
        const payload = {
            enableAll: enableAll,
            promoPush: promosPush,
            promoWhatsapp: promosWhatsapp,
            socialPush: socialPush,
            orderPush: ordersPush,
            orderWhatsapp: ordersWhatsapp,
        };

        try {
            const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/putnotifications`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Settings updated', ToastAndroid.SHORT);
                }
                safeNavigation("/screens/Settings");
            }
        } catch (error) {
            console.error("error in uploading", error);
        }
    };

    return (
        <Fragment>
            {notificationmodal && (
                <Modal animationType="slide" transparent={true} visible={notificationmodal}>
                    <NotificationModal toggle={() => setNotificationModal(false)} />
                </Modal>
            )}

            <BackRouting title="Notification settings" />
            <View className="flex-1 bg-background">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
                >
                    <View className="bg-white rounded-lg border border-border p-4 mb-3">
                        <View className="flex-row items-start justify-between">
                            <View className="flex-row flex-1">
                                <Ionicons name="notifications-outline" size={22} color="#222" />
                                <View className="ml-3 flex-1">
                                    <Text className="text-textprimary font-outfit-bold text-base">Enable all</Text>
                                    <Text className="text-textsecondary font-outfit text-sm mt-1">
                                        Activate all notifications
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={enableAll}
                                onValueChange={onToggleEnableAll}
                                trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                thumbColor={enableAll ? '#FF002E' : '#fff'}
                            />
                        </View>
                    </View>

                    {/* Promos and Offers Section */}
                    <View className="bg-white rounded-lg border border-border p-4 mb-3">
                        <View className="flex-row">
                            <MaterialIcons name="local-offer" size={22} color="#9C27B0" />
                            <View className="ml-3 flex-1">
                                <Text className="text-textprimary font-outfit-bold text-base">Promos and offers</Text>
                                <Text className="text-textsecondary font-outfit text-sm mt-1">
                                    Receive updates about coupons, promotions, and money-saving offers
                                </Text>
                            </View>
                        </View>

                        <View className="border-t border-border mt-4 pt-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="notifications-active" size={18} color={promosPush ? "#FF002E" : "#9E9E9E"} />
                                    <Text className="text-textprimary font-outfit ml-3">Push</Text>
                                </View>
                                <Switch
                                    value={promosPush}
                                    onValueChange={setPromosPush}
                                    trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                    thumbColor={promosPush ? '#FF002E' : '#fff'}
                                    disabled={enableAll}
                                />
                            </View>

                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="whatsapp" size={18} color={promosWhatsapp ? "#FF002E" : "#9E9E9E"} />
                                    <Text className="text-textprimary font-outfit ml-3">WhatsApp</Text>
                                </View>
                                <Switch
                                    value={promosWhatsapp}
                                    onValueChange={setPromosWhatsapp}
                                    trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                    thumbColor={promosWhatsapp ? '#FF002E' : '#fff'}
                                    disabled={enableAll}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Social Notifications Section */}
                    <View className="bg-white rounded-lg border border-border p-4 mb-3">
                        <View className="flex-row">
                            <Ionicons name="people-outline" size={22} color="#2196F3" />
                            <View className="ml-3 flex-1">
                                <Text className="text-textprimary font-outfit-bold text-base">Social notifications</Text>
                                <Text className="text-textsecondary font-outfit text-sm mt-1">
                                    Get notified when someone follows you or interacts with your posts
                                </Text>
                            </View>
                        </View>

                        <View className="border-t border-border mt-4 pt-4 flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <MaterialIcons name="notifications-active" size={18} color={socialPush ? "#FF002E" : "#9E9E9E"} />
                                <Text className="text-textprimary font-outfit ml-3">Push</Text>
                            </View>
                            <Switch
                                value={socialPush}
                                onValueChange={setSocialPush}
                                trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                thumbColor={socialPush ? '#FF002E' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    {/* Orders and Purchases Section */}
                    <View className="bg-white rounded-lg border border-border p-4">
                        <View className="flex-row">
                            <Ionicons name="receipt-outline" size={22} color="#4CAF50" />
                            <View className="ml-3 flex-1">
                                <Text className="text-textprimary font-outfit-bold text-base">Orders and purchases</Text>
                                <Text className="text-textsecondary font-outfit text-sm mt-1">
                                    Receive updates about your orders and memberships
                                </Text>
                            </View>
                        </View>

                        <View className="border-t border-border mt-4 pt-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="notifications-active" size={18} color={ordersPush ? "#FF002E" : "#9E9E9E"} />
                                    <Text className="text-textprimary font-outfit ml-3">Push</Text>
                                </View>
                                <Switch
                                    value={ordersPush}
                                    onValueChange={setOrdersPush}
                                    trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                    thumbColor={ordersPush ? '#FF002E' : '#fff'}
                                    disabled={enableAll}
                                />
                            </View>

                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="whatsapp" size={18} color={ordersWhatsapp ? "#FF002E" : "#9E9E9E"} />
                                    <Text className="text-textprimary font-outfit ml-3">WhatsApp</Text>
                                </View>
                                <Switch
                                    value={ordersWhatsapp}
                                    onValueChange={setOrdersWhatsapp}
                                    trackColor={{ false: '#E0E0E0', true: '#ffdbdf' }}
                                    thumbColor={ordersWhatsapp ? '#FF002E' : '#fff'}
                                    disabled={enableAll}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                {buttonActive ? (
                    <TouchableOpacity 
                        onPress={submitNotificationSettings} 
                        className="bg-primary mx-4 mb-4 rounded-lg"
                        activeOpacity={0.8}
                    >
                        <View className="p-4 flex-row items-center justify-center">
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text className="text-white font-outfit-bold text-center">Save Changes</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View 
                        className="bg-gray-200 mx-4 mb-4 rounded-lg opacity-60"
                    >
                        <View className="p-4 flex-row items-center justify-center">
                            <Ionicons name="save-outline" size={20} color="#9E9E9E" style={{ marginRight: 8 }} />
                            <Text className="text-textsecondary font-outfit-bold text-center">Save Changes</Text>
                        </View>
                    </View>
                )}
            </View>
        </Fragment>
    );
}