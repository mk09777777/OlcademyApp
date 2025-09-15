import { View, TouchableOpacity, Text } from "react-native";
import PreferenceStyles from "../styles/preference";
import Entypo from '@expo/vector-icons/Entypo';
import { CheckBox } from "@rneui/themed";
import { useState } from "react";

export default function Preference({ togglepref,senddatatoparent , message , sorting }) {
    const [selectedOption, setSelectedOption] = useState(message?`${message}`:"relevance");
    const [applyactive, setapplyactive] = useState(false);

    const options = [
        { label: "Verified", value: "Verified" },
        { label: "High Rating", value: "High Rating" },
        { label: "Latest", value: "Latest" },
        { label: "Relevance", value: "Relevance" }
    ];

    const handleSelection = (value) => {
        setSelectedOption(value);
      
        setapplyactive(value !== message);
    };
    const handleSendtoParent=()=>{
        senddatatoparent(selectedOption)
        sorting()
        togglepref()
    }

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.53)", justifyContent: "flex-end" }}>
            <View style={PreferenceStyles.background}>
                <View style={PreferenceStyles.headingContainer}>
                    <TouchableOpacity style={PreferenceStyles.imgcontainer} onPress={togglepref}>
                        <Entypo name="circle-with-cross" size={34} color="#2f2f37" style={PreferenceStyles.crossimg} />
                    </TouchableOpacity>
                    <Text style={PreferenceStyles.headingText}>Sort By</Text>
                </View>
                <View style={PreferenceStyles.preferenceContainer}>
                    {options.map((option, index) => (
                        <CheckBox
                            key={index}
                            title={option.label}
                            checked={selectedOption === option.value}
                            onPress={() => handleSelection(option.value)}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checkedColor="#E91E63"
                        />
                    ))}
                </View>
                <View style={PreferenceStyles.Applycontainer}>
                    <TouchableOpacity 
                        style={applyactive ? PreferenceStyles.ApplyButtonActive : PreferenceStyles.ApplyButton} 
                        disabled={!applyactive}
                        onPress={handleSendtoParent}
                    >
                        <Text style={applyactive ? PreferenceStyles.ApplyTextActive : PreferenceStyles.ApplyText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
