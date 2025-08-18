import React, { Fragment, useState } from "react";
import {View,Text, TouchableOpacity, Modal} from "react-native";
import SettingStyles from "../../styles/Settingstyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import BackRouting from "@/components/BackRouting";
import ChangeEmailModal from "../../components/ChangeEmail"
import { useSafeNavigation } from "@/hooks/navigationPage";
export default function Settings(){
const [changeEmail,setchangeEmail] = useState(false)
const { safeNavigation } = useSafeNavigation();
const toggleEmailModal=()=>{
    setchangeEmail(!changeEmail)
}

    return(
        <Fragment>
            <BackRouting tittle="Account Settings"/>
            <View style={SettingStyles.backgrond}>
            {/* <Ionicons name="arrow-back" size={26} color="black" style={SettingStyles.backIcon} />
            <Text style={SettingStyles.Heading1}>Settings</Text> */}
            <TouchableOpacity onPress={()=>safeNavigation("/screens/DeleteAccount")} style={SettingStyles.SettinContainer11}>
                <Text style={SettingStyles.settinText1}>Delete account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleEmailModal} style={SettingStyles.SettinContainer21}>
                <Text style={SettingStyles.settinText1}>change email</Text>

            </TouchableOpacity>
            <Modal 
            animationType="slide"
            visible={changeEmail}
            onRequestClose={toggleEmailModal}
            >
                <ChangeEmailModal toggle={toggleEmailModal}/>
            </Modal>
            </View>
        </Fragment>
    )

}