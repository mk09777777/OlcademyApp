import React, { Fragment, useState } from "react";
import {View,Text, TouchableOpacity, Modal} from "react-native";
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
            <View className="flex-1 bg-background p-4">
            <TouchableOpacity onPress={()=>safeNavigation("/screens/DeleteAccount")} className="bg-white p-4 rounded-lg mb-3 border border-border">
                <Text className="text-primary text-base font-outfit">Delete account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleEmailModal} className="bg-white p-4 rounded-lg mb-3 border border-border">
                <Text className="text-textprimary text-base font-outfit">change email</Text>

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