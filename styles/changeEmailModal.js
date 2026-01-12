import { Dimensions,StyleSheet } from "react-native";


const {width} = Dimensions.get("window")

const ChangeEmailStyles = StyleSheet.create({
    backgrond:{
        backgroundColor: '#ffffff',
        flex:1,
        flexDirection:"column",
        display:"flex",
    },
   changeText:{
    marginLeft:10,
    fontSize:16,
    fontFamily: 'outfit-medium ',
    color:"#000000",
    fontWeight:"bold",
    marginBottom:10,
    marginTop:20,
   },
   changeText2:{
    marginLeft:10,
    fontSize:15,
    fontFamily: 'outfit ',
    color:"#000000",
    marginBottom:10,
    fontWeight:"500"
   },
   backIcon:{
    marginLeft:10,
    marginTop:10
},

SettinContainer1:{
    marginTop:20,
    display:"flex",
    flexDirection:"column",
    marginLeft:10,
    padding:5,
    borderBottomWidth:1,
    borderBottomColor:"#f0f0f1",
    marginRight:10,
},
});

export default ChangeEmailStyles;