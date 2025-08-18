import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("window");
const PreferenceStyles=StyleSheet.create({
    background: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 2,
        elevation: 5,
        width: "100%",  
        alignSelf: "stretch",  
    },
    
    
    headingContainer: {
        elevation: 5,
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
    preferenceContainer:{
        display: "flex",
        flexDirection: "column",
        padding:7,
        justifyContent:"space-between"
        ,backgroundColor:"white",
        marginTop:2

    },
    Applycontainer:{
        display: "flex",
        backgroundColor:"white",
        marginTop:2,
        padding:6
    },
    ApplyButtonActive:{
        backgroundColor:"#E91E63",
        borderRadius:10,
        marginLeft:15,
        marginRight:15,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:11
    },
    ApplyButton:{
        backgroundColor:"#e6e9f0",
        borderRadius:10,
        marginLeft:15,
        marginRight:15,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:11
    },
    ApplyTextActive:{
        color:"white",
        fontSize:15,
        fontWeight:"bold"
    },
    ApplyText:{
        color:"#b5b8c1",
        fontSize:15,
        fontWeight:"bold"
    }
});
export default PreferenceStyles;