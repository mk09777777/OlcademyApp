import React, { Fragment } from "react";
import {View,Text, TouchableOpacity} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";
export default function Settings(){
    const { safeNavigation } = useSafeNavigation();

    return(
        <Fragment>
            <BackRouting tittle="Settings"/>
            <View className="flex-1 bg-background p-4">
            <View className="bg-white p-4 rounded-2.5 mb-4 shadow-sm">
                <Text className="text-lg font-outfit-bold text-textprimary mb-2">Edit profile</Text>
                <Text className="text-sm font-outfit text-textsecondary">Change your name, description and profile photo</Text>
            </View>
            <TouchableOpacity onPress={()=>safeNavigation("/screens/SettingNotifications")} className="bg-white p-4 rounded-2.5 mb-4 shadow-sm">
                <Text className="text-lg font-outfit-bold text-textprimary mb-2">Notification settings</Text>
                <Text className="text-sm font-outfit text-textsecondary">Define what alerts and notifications you want to see</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>safeNavigation("/screens/AccountSettings")} className="bg-white p-4 rounded-2.5 mb-4 shadow-sm">
                <Text className="text-lg font-outfit-bold text-textprimary mb-2">Account settings</Text>
                <Text className="text-sm font-outfit text-textsecondary">Delete your account</Text>
            </TouchableOpacity>
            </View>
        </Fragment>
    )

}