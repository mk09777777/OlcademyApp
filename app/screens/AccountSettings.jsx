import React, { Fragment, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
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
            <BackRouting tittle="Account Settings" />
            <View className="flex-1 bg-background p-4">
                
                {/* Delete Account Card */}
                <TouchableOpacity 
                    onPress={() => safeNavigation("/screens/DeleteAccount")} 
                    className="bg-white p-5 rounded-3xl mb-4 shadow-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#F44336',
                    }}
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View 
                                style={{
                                    backgroundColor: '#FFEBEE',
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="trash-outline" size={24} color="#F44336" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-primary text-base font-outfit-bold">Delete account</Text>
                                <Text className="text-textsecondary text-sm font-outfit mt-1">Permanently remove your account</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                borderRadius: 20,
                                padding: 8,
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#F44336" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Change Email Card */}
                <TouchableOpacity 
                    onPress={toggleEmailModal} 
                    className="bg-white p-5 rounded-3xl mb-4 shadow-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#2196F3',
                    }}
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View 
                                style={{
                                    backgroundColor: '#E3F2FD',
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="mail-outline" size={24} color="#2196F3" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-textprimary text-base font-outfit-bold">Change email</Text>
                                <Text className="text-textsecondary text-sm font-outfit mt-1">Update your email address</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                borderRadius: 20,
                                padding: 8,
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#2196F3" />
                        </View>
                    </View>
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