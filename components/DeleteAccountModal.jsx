import React, { Fragment, useState } from "react";
import { View, Text , TouchableOpacity, TextInput } from "react-native"
import DeleteAccountModalStyles from "../styles/DeleteAccountModalStyles";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DeleteModal({toggle}) {
const [otpBox,setOtpBox] = useState(false)

    return (
        <Fragment>
            <View style={DeleteAccountModalStyles.backgrond}>
                <Ionicons name="arrow-back" size={26} color="black" style={DeleteAccountModalStyles.backIcon} />
                <Text style={DeleteAccountModalStyles.Heading1}>You have requested for the deletion of your account</Text>
                <Text style={DeleteAccountModalStyles.Heading2}>please note that the account will get deleted.
                    By proceeding with this request, you understand and acknowledge that information associated with
                    your account cannot be retrived by you once it has been deleted. Please refer to our privacy policy
                    for more information on data deletion</Text>
                    {otpBox?<View>
                        <Text style={DeleteAccountModalStyles.Heading2}>Verfication OTP has been sent to your registered Mobile Number</Text>
                    <TextInput
                    style={DeleteAccountModalStyles.OTPContainer}
                    placeholder="Enter OTP"
                    placeholderTextColor="#000000"
                    
                    />
                </View>:<></>}
                <TouchableOpacity onPress={setOtpBox} style={DeleteAccountModalStyles.SavechangesButtonActive}>
                    <Text style={DeleteAccountModalStyles.savechangesTextAtive}>Delete my Account</Text>
                </TouchableOpacity>
             
                <TouchableOpacity onPress={toggle} style={DeleteAccountModalStyles.NotNowButtonActive}>
                    <Text style={DeleteAccountModalStyles.NotNowTextAtive}>Back to Settings</Text>
                </TouchableOpacity>
            </View>
        </Fragment>
    )
}