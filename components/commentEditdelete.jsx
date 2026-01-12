import React, { useRef, useState } from "react";
import {View,TouchableOpacity,Text} from"react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function EditBox({toggle,sendData,handleEdit}){
    const[deleteactive,setdeleteactive]=useState(false)
    const[editeactive,seteditactive]=useState(false)
    const editref = useRef()
    const senddatatoparent = () => {
        setdeleteactive(true);
        sendData(true);
        toggle();
    };

    const handledit=()=>{
        seteditactive(true)
        handleEdit(true,editref)
        toggle()
    }    
    return(
        <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={toggle} className="mr-4">
                        <Entypo name="circle-with-cross" size={34} color="#2f2f37" />
                    </TouchableOpacity>
                    <Text className="text-lg font-outfit-bold color-gray-900 flex-1">Your comment for Suraj's Review</Text>
                    </View>
                    <View className="gap-4">
                        <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <TouchableOpacity onPress={handledit} className="flex-1">
                                <Text className="text-base font-outfit-bold color-gray-900">Edit</Text>
                                <Text className="text-sm color-gray-600 font-outfit mt-1">Edit your comment</Text>
                            </TouchableOpacity>
                            <Feather name="edit" size={20} color="black" className="ml-4" />
                        </View>
                        <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <TouchableOpacity onPress={senddatatoparent} className="flex-1">
                                <Text className="text-base font-outfit-bold color-gray-900">Delete</Text>
                                <Text className="text-sm color-gray-600 font-outfit mt-1">Delete your comment</Text>
                            </TouchableOpacity>
                            <AntDesign name="minuscircleo" size={20} color="black" className="ml-4" />
                        </View>
                    </View>
            </View>

        </View>
            
    )
}