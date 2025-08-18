import React, { Fragment, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import AddStyles from "../styles/AddrequestStyles";
import Entypo from '@expo/vector-icons/Entypo';

export default function AddRequest({ toggle, data }) {
    const [reqest, setrequest] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [submitActive, setsubmitActive] = useState(false);

    const handleItem = (item) => {
        if (selectedItem === item) {
            setSelectedItem(null); 
            setsubmitActive(reqest.length > 0); 
        } else {
            setSelectedItem(item);
            setsubmitActive(true);
        }
    };

    const handleSubmit = () => {
        if (selectedItem || reqest) {
            data(selectedItem, reqest);
            toggle()
        }
    };

    const selectRequest = [
        "Birthday",
        "Anniversary",
        "Date",
        "Other"
    ];

    return (
        <Fragment>
            <View style={AddStyles.background}>
                <View style={AddStyles.RequestContainer}>
                    <View style={AddStyles.crossButtonContainer1}>
                        <TouchableOpacity onPress={toggle} style={AddStyles.crossbuttonConainer2}>
                            <Entypo name="cross" size={26} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text style={AddStyles.Text1}>
                        Mention any special requests
                    </Text>

                    <View style={AddStyles.InputRequestsContainer}>
                        <TextInput
                            value={reqest}
                            style={AddStyles.inputBox}
                            placeholder="Start typing here..."
                            placeholderTextColor="#676667"
                            onChangeText={(text) => {
                                setrequest(text);
                                setsubmitActive(text.length > 0 || selectedItem !== null);
                            }}
                        />

                        <View style={AddStyles.SelectRequestContainer}>
                            {selectRequest.map((item) => (
                                <TouchableOpacity key={item} onPress={() => handleItem(item)}>
                                    <View style={selectedItem === item ? AddStyles.RequestSelectActive : AddStyles.RequestSelect}>
                                        <Text style={AddStyles.selectText}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={AddStyles.InfoText}>
                        We will pass your request to the restaurant.
                    </Text>
                    <Text style={AddStyles.InfoText2}>
                        However the right to fulfill the request lies solely with the restaurant.
                    </Text>

                    <TouchableOpacity onPress={handleSubmit} disabled={!submitActive}>
                        <View style={submitActive ? AddStyles.submitButtonActive : AddStyles.submitButton}>
                            <Text style={submitActive ? AddStyles.submitTextActive : AddStyles.submitText}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Fragment>
    );
}
