import React, { useState, Fragment } from "react";
import { Text, View, TouchableOpacity, TextInput, Modal } from "react-native";
import DeleteAccountStyles from "../../styles/DeleteAccountStyle";
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
      <View style={DeleteAccountStyles.backgrond}>
        {/* <Ionicons name="arrow-back" size={26} color="black" style={DeleteAccountStyles.backIcon} /> */}
        <Text style={DeleteAccountStyles.Heading1}>Delete account</Text>
        <Text style={DeleteAccountStyles.Heading2}>Why would you like to delete your account?</Text>

        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason.id}
            style={[
              DeleteAccountStyles.ChoiceContainer,
              selectedReasons.includes(reason.id) && { borderColor: 'green', borderWidth: 2 },
            ]}
            onPress={() => handleToggleSelect(reason.id)}
          >
            {selectedReasons.includes(reason.id) && (
              <AntDesign name={selectedReasons.includes(reason.id) ? "checksquare" : "checksquare0"} size={20} color={selectedReasons.includes(reason.id) ? "green" : "black"} style={DeleteAccountStyles.choiceLogo} />
            )}
            <Text style={DeleteAccountStyles.ChoiceText}>{reason.text}</Text>

          </TouchableOpacity>
          
        ))}
        {otherVisible?<View style={DeleteAccountStyles.OtherContainer}>
          <TextInput
          value={otherreason}
          onChangeText={setotherReason}
          placeholder="other..."
          placeholderTextColor="black"
          cursorColor="#black"
          multiline
          />
        </View>:<></>}
        <View style={{padding:20}}></View>
        <TouchableOpacity onPress={setData} style={DeleteAccountStyles.SavechangesButtonActive}>
          <Text style={DeleteAccountStyles.savechangesTextAtive}>Next</Text>
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
