import React, { Fragment } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";

export default function Settings() {
    const { safeNavigation } = useSafeNavigation();

    return (
        <Fragment>
            <BackRouting tittle="Settings" />
            <View className="flex-1 bg-background p-4">
                
                {/* Edit Profile Card */}
                <TouchableOpacity 
                    onPress={() => safeNavigation("/screens/ProfileScreen")}
                    className="bg-white p-5 rounded-3xl mb-4 shadow-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#FF002E',
                    }}
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View 
                                style={{
                                    backgroundColor: '#FFF0F0',
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="person-outline" size={24} color="#FF002E" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-outfit-bold text-textprimary mb-1">Edit profile</Text>
                                <Text className="text-sm font-outfit text-textsecondary">Change your name, description and profile photo</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                backgroundColor: 'rgba(255, 0, 46, 0.1)',
                                borderRadius: 20,
                                padding: 8,
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#FF002E" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Notification Settings Card */}
                <TouchableOpacity 
                    onPress={() => safeNavigation("/screens/SettingNotifications")} 
                    className="bg-white p-5 rounded-3xl mb-4 shadow-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#FF9800',
                    }}
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View 
                                style={{
                                    backgroundColor: '#FFF8E1',
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="notifications-outline" size={24} color="#FF9800" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-outfit-bold text-textprimary mb-1">Notification settings</Text>
                                <Text className="text-sm font-outfit text-textsecondary">Define what alerts and notifications you want to see</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                borderRadius: 20,
                                padding: 8,
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#FF9800" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Account Settings Card */}
                <TouchableOpacity 
                    onPress={() => safeNavigation("/screens/AccountSettings")} 
                    className="bg-white p-5 rounded-3xl mb-4 shadow-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#F44336',
                    }}
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View 
                                style={{
                                    backgroundColor: '#FFEBEE',
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="settings-outline" size={24} color="#F44336" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-outfit-bold text-textprimary mb-1">Account settings</Text>
                                <Text className="text-sm font-outfit text-textsecondary">Delete your account</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                borderRadius: 20,
                                padding: 8,
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#F44336" />
                        </View>
                    </View>
                </TouchableOpacity>

            </View>
        </Fragment>
    )
}