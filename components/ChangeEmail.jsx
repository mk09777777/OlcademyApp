import React from "react";
import { View,Text, TouchableOpacity } from "react-native";
import ChangeEmailStyles from "../styles/changeEmailModal";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ChangeEmailModal({toggle}){



    return(
        <View style={ChangeEmailStyles.backgrond}>
             <TouchableOpacity onPress={toggle}>
             <Ionicons name="arrow-back" size={26} color="black" style={ChangeEmailStyles.backIcon} />
             </TouchableOpacity>
                <Text style={ChangeEmailStyles.changeText}>Change email</Text>
                <Text style={ChangeEmailStyles.changeText2}>To change your email, please login through your website, and go to the settings section, In case your face any difficulties feel free to contact us at @help@zomato.com</Text>
        </View>
    )
}