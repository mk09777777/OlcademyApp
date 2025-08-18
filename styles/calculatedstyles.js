import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("window");
const CalculatedStyles = StyleSheet.create({
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
    informatoincontainer: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        marginTop: 3
    },
    ratingimg: {
        width: "100%",  
        height: undefined,
        aspectRatio: 16 / 9,
        resizeMode: "contain", 
        marginTop: 10
    }
    ,
    ratingText:
    {
        color:"black",
        fontSize:14,
        fontWeight:"bold",
        padding:10
    },
    okaybutton:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        marginLeft:20,
        marginTop:5,
        marginRight:20,
        backgroundColor:"#E91E63",
        padding:10
    },
    okayText:{
        color:"white",
        fontSize:14,
        fontWeight:"bold",
    }



});
export default CalculatedStyles;