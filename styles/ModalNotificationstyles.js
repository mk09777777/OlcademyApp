import { Dimensions,StyleSheet } from "react-native";

const {width} = Dimensions.get("window")

const NotificationModalStyles = StyleSheet.create({
    background:{
        backgroundColor:"rgba(0, 0, 0, 0.53)",
        display:"flex",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        flex:1
    },
    mainContainer:{
        display:"flex",
        flexDirection:"column",
        padding:10,
        borderRadius:10,
        marginLeft:20,
        marginRight:20,
        backgroundColor:"white"
    },
    Notifimg: {
        width: "100%",  
        height: undefined,
        aspectRatio: 16 / 9,
        resizeMode: "contain", 
        marginLeft:5,
        marginRight:5,
    }
    ,
    NotifText:{
        fontSize:16,
        color:"#000",
        fontWeight:"600",
        marginLeft:10,
        marginRight:10,
    },
    NotifButton:{
        marginLeft:15,
        marginRight:15,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        padding:10,
        borderRadius:7,
        backgroundColor:"#ea4c5f",
        marginTop:10
    },
    NotifText2:{
        color:"white",
        fontSize:16,
        fontWeight:"600",
    },
    NotifButton2:{
        marginLeft:15,
        marginRight:15,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        padding:10,
        borderRadius:7,
        backgroundColor:"white",
        marginTop:5
    },
    NotNowText:{
        color:"#ea4c5f",
        fontSize:16,
        fontWeight:"600",
    }
});
export default NotificationModalStyles;