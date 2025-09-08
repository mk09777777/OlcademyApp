import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Switch, Modal, TouchableOpacity, ToastAndroid, Platform } from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import NotificationModal from '../../components/NotificationModal';
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { API_CONFIG } from '../../config/apiConfig';

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackRouting from "@/components/BackRouting";
import { useSafeNavigation } from "@/hooks/navigationPage";
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

            <View className="flex-1 bg-background">
                <ScrollView>
                    <View className="bg-white p-4 mb-4 border-b border-border">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-textprimary font-outfit-bold text-lg">Enable all</Text>
                            <Switch
                                value={enableAll}
                                onValueChange={onToggleEnableAll}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={enableAll ? '#ea4c5f' : '#fff'}
                            />
                        </View>
                        <Text className="text-textsecondary font-outfit text-sm">Activate all notifications</Text>
                    </View>

                    <View className="bg-white p-4 mb-4">
                        <Text className="text-textprimary font-outfit-bold text-lg mb-2">Promos and offers</Text>
                        <Text className="text-textsecondary font-outfit text-sm mb-4">Receive updates about coupons, promotions, and money-saving offers</Text>
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center">
                                <MaterialIcons name="notifications-active" size={24} color={promosPush ? "#ea4c5f" : "black"} />
                                <Text className="text-textprimary font-outfit ml-2">Push</Text>
                            </View>
                            <Switch
                                value={promosPush}
                                onValueChange={setPromosPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={promosPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="whatsapp" size={24} color={promosWhatsapp ? "#ea4c5f" : "black"} />
                                <Text className="text-textprimary font-outfit ml-2">Whatsapp</Text>
                            </View>
                            <Switch
                                value={promosWhatsapp}
                                onValueChange={setPromosWhatsapp}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={promosWhatsapp ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View className="bg-white p-4 mb-4">
                        <Text className="text-textprimary font-outfit-bold text-lg mb-2">Social notifications</Text>
                        <Text className="text-textsecondary font-outfit text-sm mb-4">Get notified when someone follows you or interacts with your posts</Text>
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <MaterialIcons name="notifications-active" size={24} color={socialPush ? "#ea4c5f" : "black"} />
                                <Text className="text-textprimary font-outfit ml-2">Push</Text>
                            </View>
                            <Switch
                                value={socialPush}
                                onValueChange={setSocialPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={socialPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View className="bg-white p-4 mb-4">
                        <Text className="text-textprimary font-outfit-bold text-lg mb-2">Orders and purchases</Text>
                        <Text className="text-textsecondary font-outfit text-sm mb-4">Receive updates about your orders and memberships</Text>
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center">
                                <MaterialIcons name="notifications-active" size={24} color={ordersPush ? "#ea4c5f" : "black"} />
                                <Text className="text-textprimary font-outfit ml-2">Push</Text>
                            </View>
                            <Switch
                                value={ordersPush}
                                onValueChange={setOrdersPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={ordersPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="whatsapp" size={24} color={ordersWhatsapp ? "#ea4c5f" : "black"} />
                                <Text className="text-textprimary font-outfit ml-2">Whatsapp</Text>
                            </View>
                            <Switch
                                value={ordersWhatsapp}
                                onValueChange={setOrdersWhatsapp}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={ordersWhatsapp ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View className="p-12" />
                </ScrollView>

                {buttonActive ? (
                    <TouchableOpacity onPress={submitNotificationSettings} className="bg-primary p-4 m-4 rounded-lg">
                        <Text className="text-white font-outfit-bold text-center">Save Changes</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="bg-gray-300 p-4 m-4 rounded-lg">
                        <Text className="text-textsecondary font-outfit-bold text-center">Save Changes</Text>
                    </View>
                )}
            </View>
        </Fragment>
    );
}
