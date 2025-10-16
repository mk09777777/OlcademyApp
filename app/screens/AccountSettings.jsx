import React, { Fragment, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BackRouting from "@/components/BackRouting";
import ChangeEmailModal from "../../components/ChangeEmail";
import { useSafeNavigation } from "@/hooks/navigationPage";

export default function Settings() {
    const [changeEmail, setchangeEmail] = useState(false);
    const { safeNavigation } = useSafeNavigation();
    
    const toggleEmailModal = () => {
        setchangeEmail(!changeEmail);
    };

    return (
        <Fragment>
            <BackRouting title="Account Settings" />
            <View className="flex-1 bg-background p-4">
                <TouchableOpacity
                    onPress={() => safeNavigation("/screens/DeleteAccount")}
                    className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border"
                    activeOpacity={0.7}
                >
                    <Text className="text-textprimary text-base font-outfit">Delete account</Text>
                    <Ionicons name="chevron-forward" size={22} color="#222" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleEmailModal}
                    className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg border border-border"
                    activeOpacity={0.7}
                >
                    <Text className="text-textprimary text-base font-outfit">Change email</Text>
                    <Ionicons name="chevron-forward" size={22} color="#222" />
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    visible={changeEmail}
                    onRequestClose={toggleEmailModal}
                >
                    <ChangeEmailModal toggle={toggleEmailModal} />
                </Modal>
            </View>
        </Fragment>
    );
}