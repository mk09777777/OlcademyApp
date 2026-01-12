import React, { Fragment } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";

export default function Settings() {
    const { safeNavigation } = useSafeNavigation();

    return (
        <Fragment>
            <BackRouting title="Settings" />
            <View className="flex-1 bg-background p-4">
                <TouchableOpacity
                    onPress={() => safeNavigation("/screens/ProfileScreen")}
                    className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border"
                    activeOpacity={0.7}
                >
                    <Text className="text-textprimary text-base font-outfit">Edit profile</Text>
                    <Ionicons name="chevron-forward" size={22} color="#222" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => safeNavigation("/screens/SettingNotifications")}
                    className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border"
                    activeOpacity={0.7}
                >
                    <Text className="text-textprimary text-base font-outfit">Notification settings</Text>
                    <Ionicons name="chevron-forward" size={22} color="#222" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => safeNavigation("/screens/AccountSettings")}
                    className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg border border-border"
                    activeOpacity={0.7}
                >
                    <Text className="text-textprimary text-base font-outfit">Account settings</Text>
                    <Ionicons name="chevron-forward" size={22} color="#222" />
                </TouchableOpacity>
            </View>
        </Fragment>
    )
}