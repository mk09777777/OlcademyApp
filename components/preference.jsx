import { View, TouchableOpacity, Text } from "react-native";
// import PreferenceStyles from "../styles/preference";
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
        <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity className="p-2" onPress={togglepref}>
                        <Entypo name="circle-with-cross" size={34} color="#2f2f37" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Sort By</Text>
                </View>
                <View className="mb-6">
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
                <View className="">
                    <TouchableOpacity 
                        className={`py-3 px-6 rounded-lg items-center ${applyactive ? 'bg-pink-500' : 'bg-gray-300'}`} 
                        disabled={!applyactive}
                        onPress={handleSendtoParent}
                    >
                        <Text className={`font-semibold ${applyactive ? 'text-white' : 'text-gray-500'}`}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
