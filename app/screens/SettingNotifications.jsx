import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Switch, Modal, TouchableOpacity, ToastAndroid, Platform } from "react-native";
import NotifcationStyles from "../../styles/SettingNotificationStyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import NotificationModal from '../../components/NotificationModal';
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
            const response = await fetch('http://192.168.0.101:3000/api/getnotifications', {
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
            const response = await fetch('http://192.168.0.101:3000/api/putnotifications', {
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

            <View style={NotifcationStyles.background}>
                <ScrollView>
                    <View style={NotifcationStyles.NotficationContainer}>
                        <View style={NotifcationStyles.PushnotificationContainer}>
                            <Text style={NotifcationStyles.NotificationText}>Enable all</Text>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={enableAll}
                                onValueChange={onToggleEnableAll}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={enableAll ? '#ea4c5f' : '#fff'}
                            />
                        </View>
                        <Text style={NotifcationStyles.NotificationText2}>Activate all notifications</Text>
                    </View>

                    <View style={NotifcationStyles.NotficationContainer2}>
                        <Text style={NotifcationStyles.NotificationText}>Promos and offers</Text>
                        <Text style={NotifcationStyles.NotificationText2}>Receive updates about coupons, promotions, and money-saving offers</Text>
                        <View style={NotifcationStyles.PushnotificationContainer2}>
                            <View style={NotifcationStyles.notificationTextcontainer}>
                                <MaterialIcons name="notifications-active" size={24} color={promosPush ? "#ea4c5f" : "black"} />
                                <Text style={NotifcationStyles.NotificationText3}>Push</Text>
                            </View>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={promosPush}
                                onValueChange={setPromosPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={promosPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>

                        <View style={NotifcationStyles.PushnotificationContainer3}>
                            <View style={NotifcationStyles.notificationTextcontainer}>
                                <FontAwesome5 name="whatsapp" size={24} color={promosWhatsapp ? "#ea4c5f" : "black"} />
                                <Text style={NotifcationStyles.NotificationText3}>Whatsapp</Text>
                            </View>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={promosWhatsapp}
                                onValueChange={setPromosWhatsapp}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={promosWhatsapp ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View style={NotifcationStyles.NotficationContainer2}>
                        <Text style={NotifcationStyles.NotificationText}>Social notifications</Text>
                        <Text style={NotifcationStyles.NotificationText2}>Get notified when someone follows you or interacts with your posts</Text>
                        <View style={NotifcationStyles.PushnotificationContainer}>
                            <View style={NotifcationStyles.notificationTextcontainer}>
                                <MaterialIcons name="notifications-active" size={24} color={socialPush ? "#ea4c5f" : "black"} />
                                <Text style={NotifcationStyles.NotificationText3}>Push</Text>
                            </View>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={socialPush}
                                onValueChange={setSocialPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={socialPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View style={NotifcationStyles.NotficationContainer2}>
                        <Text style={NotifcationStyles.NotificationText}>Orders and purchases</Text>
                        <Text style={NotifcationStyles.NotificationText2}>Receive updates about your orders and memberships</Text>
                        <View style={NotifcationStyles.PushnotificationContainer2}>
                            <View style={NotifcationStyles.notificationTextcontainer}>
                                <MaterialIcons name="notifications-active" size={24} color={ordersPush ? "#ea4c5f" : "black"} />
                                <Text style={NotifcationStyles.NotificationText3}>Push</Text>
                            </View>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={ordersPush}
                                onValueChange={setOrdersPush}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={ordersPush ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>

                        <View style={NotifcationStyles.PushnotificationContainer3}>
                            <View style={NotifcationStyles.notificationTextcontainer}>
                                <FontAwesome5 name="whatsapp" size={24} color={ordersWhatsapp ? "#ea4c5f" : "black"} />
                                <Text style={NotifcationStyles.NotificationText3}>Whatsapp</Text>
                            </View>
                            <Switch
                                style={NotifcationStyles.togglebutton}
                                value={ordersWhatsapp}
                                onValueChange={setOrdersWhatsapp}
                                trackColor={{ false: '#767577', true: '#ffdbdf' }}
                                thumbColor={ordersWhatsapp ? '#ea4c5f' : '#fff'}
                                disabled={enableAll}
                            />
                        </View>
                    </View>

                    <View style={{ padding: 50 }} />
                </ScrollView>

                {buttonActive ? (
                    <TouchableOpacity onPress={submitNotificationSettings} style={NotifcationStyles.SavechangesButtonActive}>
                        <Text style={NotifcationStyles.savechangesTextAtive}>Save Changes</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={NotifcationStyles.SavechangesButton}>
                        <Text style={NotifcationStyles.savechangesText}>Save Changes</Text>
                    </View>
                )}
            </View>
        </Fragment>
    );
}
