import React, { Fragment } from "react";
import {View,Text, TouchableOpacity} from "react-native";
import SettingStyles from "../../styles/Settingstyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";
export default function Settings(){
    const { safeNavigation } = useSafeNavigation();

    return(
        <Fragment>
            <BackRouting tittle="Settings"/>
            <View style={SettingStyles.backgrond}>
            {/* <Ionicons name="arrow-back" size={26} color="black" style={SettingStyles.backIcon} />
            <Text style={SettingStyles.Heading1}>Settings</Text> */}
            <View style={SettingStyles.SettinContainer1}>
                <Text style={SettingStyles.settinText}>Edit profile</Text>
                <Text style={SettingStyles.settinText2}>Change your name, description and profile photo</Text>
            </View>
            <TouchableOpacity onPress={()=>safeNavigation("/screens/SettingNotifications")} style={SettingStyles.SettinContainer2}>
                <Text style={SettingStyles.settinText}>Notification settings</Text>
                <Text style={SettingStyles.settinText2}>Define what alerts and notifications you want to see</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>safeNavigation("/screens/AccountSettings")} style={SettingStyles.SettinContainer2}>
                <Text style={SettingStyles.settinText}>Account settings</Text>
                <Text style={SettingStyles.settinText2}>Delete your account</Text>
            </TouchableOpacity>
            </View>
        </Fragment>
    )

}