import { Dimensions,StyleSheet } from "react-native";

const{width} = Dimensions.get("window")

const EditDeleteStykes = StyleSheet.create({
    background: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 2,
        elevation: 5,
        width: "100%",  
        alignSelf: "stretch",  
    },
    headingContainer: {
      
        display: "flex",
        padding: 8,
        backgroundColor: "white",
        marginTop:0,
        borderRadius: 16,
        paddingLeft:10        
    },
    crossimg: {
        alignContent: "center",
        position: "absolute",
        bottom: 27
    },
    imgcontainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    headingText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold"
    },
    buttonContainer:{
        display: "flex",
        flexDirection:"column",
        justifyContent:"space-between",
        padding:6
    },
    buttonInContainer:{
        display: "flex",
        flexDirection:"row",
        justifyContent:"space-between",
        padding:2
    },
    buttonTextContaner:{
        display: "flex",
        flexDirection:"column",
        padding:6
    },
    buttonText1:{
        color:"black",
        fontSize: 16,
        fontWeight:"bold"
    },
    buttonText2:{
        color:"#6b7280ef",
        fontSize: 12,
        marginTop:5
    },
    buttonImg:{
        marginRight:10,
        marginTop:18
    }

});
export default EditDeleteStykes;