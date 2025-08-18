import React, { useRef, useState } from "react";
import {View,TouchableOpacity,Text} from"react-native";
import EditDeleteStykes from "../styles/EditDelete";
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
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.53)", justifyContent: "flex-end" }}>
            <View style={EditDeleteStykes.background}>
                    <View style={EditDeleteStykes.headingContainer}>
                    <TouchableOpacity style={EditDeleteStykes.imgcontainer} onPress={toggle}>
                        <Entypo name="circle-with-cross" size={34} color="#2f2f37" style={EditDeleteStykes.crossimg} />
                    </TouchableOpacity>
                    <Text style={EditDeleteStykes.headingText}>Your comment for Suraj's Review</Text>
                    </View>
                    <View style={EditDeleteStykes.buttonContainer}>
                        <View style={EditDeleteStykes.buttonInContainer}>
                            <TouchableOpacity onPress={handledit} style={EditDeleteStykes.buttonTextContaner}>
                                <Text style={EditDeleteStykes.buttonText1}>Edit</Text>
                                <Text style={EditDeleteStykes.buttonText2}>Edit your comment</Text>
                            </TouchableOpacity>
                            <Feather name="edit" size={20} color="black" style={EditDeleteStykes.buttonImg} />
                        </View>
                        <View style={EditDeleteStykes.buttonInContainer}>
                            <TouchableOpacity onPress={senddatatoparent} style={EditDeleteStykes.buttonTextContaner}>
                                <Text style={EditDeleteStykes.buttonText1}>Delete</Text>
                                <Text style={EditDeleteStykes.buttonText2}>Delete your comment</Text>
                            </TouchableOpacity>
                            <AntDesign name="minuscircleo" size={20} color="black" style={EditDeleteStykes.buttonImg} />
                        </View>
                    </View>
            </View>

        </View>
            
    )
}