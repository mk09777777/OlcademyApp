import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("window")

const DeleteAccountModalStyles = StyleSheet.create({
    backgrond: {
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: "column",
        display: "flex",
    },
    backIcon: {
        marginLeft: 10,
        marginTop: 10
    },
    Heading1: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 17,
        fontWeight: "bold",
        color:"#000000"
    },
    Heading2:{
        marginLeft: 10,
        marginTop: 5,
        fontSize: 13,
        color:"#000000",
        fontWeight:"500",
        marginBottom:25
    },
    ChoiceContainer:{
        marginLeft:6,
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f1",
        padding:5,
        marginRight:6,
        display:"flex",
        flexDirection:"row"
    },
    ChoiceText:{
        fontSize:14,
        color:"#000000",
        fontWeight:"500",
        marginBottom:6,
        marginLeft:10
    },
    choiceLogo:{
        marginBottom:6,
    },
    OTPContainer:{
        marginTop:5,
        marginLeft:10,
        borderWidth:1,
        borderColor:"#f0f0f1",
        padding:10,
        marginRight:10,
        borderRadius:10
    },
    SavechangesButton:{
        display:"flex",
        flexDirection:"row",
        marginLeft:10,
        justifyContent:"center",
        marginRight:10,
        borderRadius:7,
        backgroundColor:"#e6e9f0",
        position:"absolute",
        bottom:30,
        left:0,
        right:0,
        padding:13
      },
      savechangesText:{
        fontSize:16,
        fontWeight:"500",
        color:"#aeb2be"
      },
      SavechangesButtonActive:{
        display:"flex",
        flexDirection:"row",
        marginLeft:10,
        justifyContent:"center",
        marginRight:10,
        borderRadius:7,
        backgroundColor:"#ea4c5f",
        marginTop:20,
        padding:13
      },
      savechangesTextAtive:{
        fontSize:16,
        fontWeight:"500",
        color:"white"
      },
      NotNowButtonActive:{
        display:"flex",
        flexDirection:"row",
        marginLeft:10,
        justifyContent:"center",
        marginRight:10,
        borderRadius:7,
        backgroundColor:"white",
        marginTop:10,
        padding:13
      },
      NotNowTextAtive:{
        fontSize:16,
        fontWeight:"500",
        color:"#ea4c5f"
      }


});

export default DeleteAccountModalStyles;