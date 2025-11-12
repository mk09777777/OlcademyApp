import React, { Fragment, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
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
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="bg-white rounded-2xl p-6 mx-4 w-11/12">
                    <View className="items-end mb-4">
                        <TouchableOpacity onPress={toggle} className="bg-gray-400 rounded-full p-1">
                            <Entypo name="cross" size={26} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-outfit-bold color-gray-900 mb-6 text-center">
                        Mention any special requests
                    </Text>

                    <View className="mb-6">
                        <TextInput
                            value={reqest}
                            className="border border-gray-300 rounded-lg p-4 text-base font-outfit mb-4"
                            placeholder="Start typing here..."
                            placeholderTextColor="#676667"
                            onChangeText={(text) => {
                                setrequest(text);
                                setsubmitActive(text.length > 0 || selectedItem !== null);
                            }}
                        />

                        <View className="flex-row flex-wrap gap-2">
                            {selectRequest.map((item) => (
                                <TouchableOpacity key={item} onPress={() => handleItem(item)}>
                                    <View className={`px-4 py-2 rounded-full border ${
                                        selectedItem === item 
                                            ? 'bg-primary border-primary' 
                                            : 'bg-white border-gray-300'
                                    }`}>
                                        <Text className={`text-sm font-outfit ${
                                            selectedItem === item ? 'text-white' : 'color-gray-700'
                                        }`}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text className="text-sm color-gray-600 font-outfit mb-2 text-center">
                        We will pass your request to the restaurant.
                    </Text>
                    <Text className="text-sm color-gray-600 font-outfit mb-6 text-center">
                        However the right to fulfill the request lies solely with the restaurant.
                    </Text>

                    <TouchableOpacity onPress={handleSubmit} disabled={!submitActive}>
                        <View className={`py-4 rounded-lg items-center ${
                            submitActive ? 'bg-primary' : 'bg-gray-300'
                        }`}>
                            <Text className={`text-base font-outfit-bold ${
                                submitActive ? 'text-white' : 'color-gray-500'
                            }`}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Fragment>
    );
}
