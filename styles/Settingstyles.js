import { Dimensions,StyleSheet } from "react-native";


const {width} = Dimensions.get("window")

const SettingStyles = StyleSheet.create({
    backgrond:{
        backgroundColor: '#ffffff',
        flex:1,
        flexDirection:"column",
        display:"flex",
    },
    backIcon:{
        marginLeft:10,
        marginTop:10
    },
    Heading1:{
        fontSize: 20,
        color: '#000000',
        fontWeight: '600',
        marginTop:17,
        marginLeft:10
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
    SettinContainer11:{
        marginTop:20,
        display:"flex",
        flexDirection:"column",
        marginLeft:10,
        padding:10,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f1",
        marginRight:10,
    },
    SettinContainer2:{
        marginTop:6,
        display:"flex",
        flexDirection:"column",
        marginLeft:10,
        padding:5,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f1",
        marginRight:10
    },
    SettinContainer21:{
        marginTop:6,
        display:"flex",
        flexDirection:"column",
        marginLeft:10,
        padding:10,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f1",
        marginRight:10
    },
    settinText:{
        fontSize: 13,
        color: '#000000',
        fontWeight: '600',

    },
    settinText1:{
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',

    },
    settinText2:{
        fontSize: 13,
        color: '#000000',
        fontWeight: '600',
        marginBottom:9

    }
});

export default SettingStyles;