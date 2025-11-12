import React from "react";
import { View,Text, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ChangeEmailModal({toggle}){



    return(
        <View className="flex-1 bg-white p-4">
             <TouchableOpacity onPress={toggle}>
             <Ionicons name="arrow-back" size={26} color="black" className="mb-6" />
             </TouchableOpacity>
                <Text className="text-xl font-outfit-bold color-gray-900 mb-4">Change email</Text>
                <Text className="text-sm color-gray-600 font-outfit leading-5">To change your email, please login through your website, and go to the settings section, In case your face any difficulties feel free to contact us at @help@zomato.com</Text>
        </View>
    )
}