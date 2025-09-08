import { Dimensions,StyleSheet } from "react-native";

const{width} = Dimensions.get('window')


const AddStyles = StyleSheet.create({
    background:{
        backgroundColor:"rgba(0, 0, 0, 0.53)",
        display:"flex",
        justifyContent:"center",
        flex:1,
    },
    RequestContainer:{
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        borderRadius:10,
        display:"flex",
        flexDirection:"column",
        backgroundColor:"#f4f6fa"
    },
    crossButtonContainer1:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    crossbuttonConainer2:{
        borderRadius:100,
        position:"absolute",
        bottom:30,
        alignItems:"center",
        padding:10,
        backgroundColor:"#2e2f38"
    },
    Text1:{
        marginLeft:10,
        marginTop:10,
        fontFamily: 'outfit-medium',
        fontSize:18,
        fontWeight:"500",
        color:"#1b1d1f"
    },
    InputRequestsContainer:{
        backgroundColor:"white",
        marginTop:20,
        marginLeft:10,
        marginRight:10,
        borderRadius:10,
        padding:10
    },
    inputBox:{
        borderWidth:1,
        borderRadius:14,
        borderColor:"#d3d3d2",
        paddingBottom:50,
        paddingTop:10
    },
    SelectRequestContainer:{
        display:"flex",
        flexDirection:"row",
        marginTop:20
    },
    RequestSelect:{
        borderWidth:1,
        borderRadius:10,
        borderColor:"#d3d3d2",
        padding:10,
        justifyContent:"center",
        alignItems:"center",
        marginRight:10
    },
    RequestSelectActive:{
        borderWidth:1,
        borderRadius:10,
        borderColor:"#36735b",
        padding:10,
        justifyContent:"center",
        alignItems:"center",
        marginRight:10,
        backgroundColor:"#ebfbf0"
    },
    selectText:{
        fontFamily: 'outfit',
        fontSize:16,
        fontWeight:"500",
        color:"#2d3136"
    },
    InfoText:{
        marginTop:10,
        fontWeight:"400",
        fontSize:14,
        fontFamily: 'outfit',
        color:"#9899a0",
        marginLeft:10
    },
    InfoText2:{
        fontWeight:"400",
        fontSize:14,
        fontFamily: 'outfit',
        color:"#9899a0",
        marginLeft:10
    },
    submitButton:{
        marginTop:40,
        alignItems:"center",
        display:"flex",
        borderRadius:10,
        padding:14,
        marginBottom:20,
        backgroundColor:"#e7e8f0",
        flex:1
    },
    submitText:{
        fontSize:16,
        fontWeight:"400",
        fontFamily: 'outfit',
        color:"#afb3b8"
    },
    submitButtonActive:{
        marginTop:40,
        alignItems:"center",
        display:"flex",
        borderRadius:10,
        padding:14,
        marginBottom:20,
        backgroundColor:"#01843e",
        flex:1
    },
    submitTextActive:{
        fontSize:16,
        fontFamily: 'outfit',
        fontWeight:"400",
        color:"white"
    }

});

export default AddStyles;