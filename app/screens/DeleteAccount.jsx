import React, { useState, Fragment } from "react";
import { Text, View, TouchableOpacity, TextInput, Modal } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import BackRouting from "@/components/BackRouting";
import DeleteModal from "../../components/DeleteAccountModal";

export default function DeleteAcc() {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherVisible,setOtherVisible] = useState(false)
  const [otherreason,setotherReason] = useState("")
  const [modalactive,setModalActive] = useState(false)
  const [completeReason,setCompleteReason] = useState([])
  const reasons = [
    { id: 1, text: "I don't want to use Zomato anymore" },
    { id: 2, text: "I have privacy concerns" },
    { id: 3, text: "I get too many notifications" },
    { id: 4, text: "The app is not working properly" },
    { id: 5, text: "order?(please specify)" }
  ];

  const handleToggleSelect = (id) => {
    let updatedSelectedReasons = [];
  
    if (selectedReasons.includes(id)) {
      updatedSelectedReasons = selectedReasons.filter(reasonId => reasonId !== id);
    } else {
      updatedSelectedReasons = [...selectedReasons, id];
    }
  
    setSelectedReasons(updatedSelectedReasons);
    setOtherVisible(updatedSelectedReasons.includes(5));
  };
  

  const setData = () =>{
    setCompleteReason([...completeReason,...selectedReasons,otherreason])
    setModalActive(!modalactive)
  }


  return (
    <Fragment>
      <BackRouting />
      <View className="flex-1 bg-background p-4">
        <Text className="text-textprimary text-2xl font-outfit-bold mb-4">Delete account</Text>
        <Text className="text-textsecondary text-base font-outfit mb-6">Why would you like to delete your account?</Text>

        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason.id}
            className={`flex-row items-center p-4 mb-3 bg-white rounded-lg border ${
              selectedReasons.includes(reason.id) ? 'border-green-500 border-2' : 'border-border'
            }`}
            onPress={() => handleToggleSelect(reason.id)}
          >
            {selectedReasons.includes(reason.id) && (
              <AntDesign name={selectedReasons.includes(reason.id) ? "checksquare" : "checksquare0"} size={20} color={selectedReasons.includes(reason.id) ? "green" : "black"} className="mr-3" />
            )}
            <Text className="text-textprimary text-base font-outfit flex-1">{reason.text}</Text>

          </TouchableOpacity>
          
        ))}
        {otherVisible?<View className="bg-white p-4 rounded-lg border border-border mb-6">
          <TextInput
          value={otherreason}
          onChangeText={setotherReason}
          placeholder="other..."
          placeholderTextColor="#333333"
          className="text-textprimary font-outfit"
          multiline
          />
        </View>:<></>}
        <View className="p-5"></View>
        <TouchableOpacity onPress={setData} className="bg-primary py-4 rounded-lg items-center">
          <Text className="text-white text-base font-outfit-bold">Next</Text>
        </TouchableOpacity>
        <Modal
                animationType="slide"
                visible={modalactive}
                onRequestClose={()=>setModalActive(!modalactive)}

        >
          <DeleteModal toggle = {()=>setModalActive(!modalactive)}/>
        </Modal>
      </View>
    </Fragment>
  );
}
