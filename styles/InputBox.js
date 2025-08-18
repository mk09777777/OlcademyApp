import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const InputBoxStyles = StyleSheet.create({
    background:{
        backgroundColor:"rgba(0, 0, 0, 0.53)",
        display:"flex",
        justifyContent:"center",
        alignContent:"center",
        flex:1
    },
    inputContainer:{
        display:"flex",
        flexDirection:"Column",
        padding:10,
        marginLeft:15,
        marginRight:15,
        borderRadius:10,
        backgroundColor:"white",
    },
    headingContainer:{
        display:"flex",
        flexDirection:"Row",
        alignItems:"center",
        justifyContent:"center",
        padding:10
    },
    headingText:{
        fontSize:22,
        fontWeight:"#600",
        color:"black"
    },
    inputBox:{
        marginTop:10,
        padding:10,
        borderWidth:0.5,
        borderColor:"grey",
        borderRadius:10
    },
    ConfirmButton:{
        marginLeft:10,
        marginRight:10,
        marginTop:20,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#e23845",
        marginBottom:10,
        padding:9,
        borderRadius:10
    },
    ConfirmText:{
        fontSize: 16,
        color: "white",
        fontWeight:"600",
    },
});
export default InputBoxStyles;