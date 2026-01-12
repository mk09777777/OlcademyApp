import React, { Fragment, useState } from "react";
import { View, Text , TouchableOpacity, TextInput } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DeleteModal({toggle}) {
const [otpBox,setOtpBox] = useState(false)

    return (
        <Fragment>
            <View className="flex-1 bg-white p-4">
                <Ionicons name="arrow-back" size={26} color="black" className="mb-6" />
                <Text className="text-xl font-outfit-bold color-gray-900 mb-4">You have requested for the deletion of your account</Text>
                <Text className="text-sm color-gray-600 font-outfit leading-5 mb-6">please note that the account will get deleted.
                    By proceeding with this request, you understand and acknowledge that information associated with
                    your account cannot be retrived by you once it has been deleted. Please refer to our privacy policy
                    for more information on data deletion</Text>
                    {otpBox?<View>
                        <Text className="text-sm color-gray-600 font-outfit leading-5 mb-4">Verfication OTP has been sent to your registered Mobile Number</Text>
                    <TextInput
                    className="border border-gray-300 rounded-lg p-4 text-base font-outfit mb-6"
                    placeholder="Enter OTP"
                    placeholderTextColor="#000000"
                    
                    />
                </View>:<></>}
                <TouchableOpacity onPress={setOtpBox} className="bg-red-600 py-4 rounded-lg items-center mb-4">
                    <Text className="text-white font-outfit-bold text-base">Delete my Account</Text>
                </TouchableOpacity>
             
                <TouchableOpacity onPress={toggle} className="bg-gray-200 py-4 rounded-lg items-center">
                    <Text className="color-gray-700 font-outfit-bold text-base">Back to Settings</Text>
                </TouchableOpacity>
            </View>
        </Fragment>
    )
}
/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const DeleteAccountModalStyles = StyleSheet.create({
  backgrond: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  backIcon: {
    marginBottom: 24,
  },
  Heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  Heading2: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  OTPContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  SavechangesButtonActive: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  savechangesTextAtive: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  NotNowButtonActive: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  NotNowTextAtive: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
*/