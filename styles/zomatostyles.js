import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ZomatoStyles = StyleSheet.create({
    background: {
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        backgroundColor:"white",
    },
    headercontainer: {
   
        display: "flex",
        flexDirection: "row",
        padding: 0,
        elevation: 3,
        justifyContent:"space-between",
        backgroundColor:"white"
    },
    HeadingText: {
        fontSize: 18,
        color: "#000000",
        fontWeight: "bold",
        marginLeft: 13,
        marginTop: 18,
        marginBottom: 10,
    },
    headingImg: {
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 10,

    },
    headingImg2: {
        marginTop: 13,
        marginBottom: 10,
        marginRight:12
    },
    TotalRatingContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    ratingStartcontainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    RatingsContainer: {
        display: "flex",
        backgroundColor: "green",
        marginTop: 15,
        marginLeft: 21,
        borderRadius: 7,
        flexDirection: "row",
        padding: 3,
        
    },
    RatingText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 11,
        marginLeft: 0,
    },
    RatingImg: {
        marginLeft: 1,
        marginTop:1
    },
    TotalText: {
        color: "#6b7280ef",
        fontSize: 10,
        marginTop: 18,
        marginLeft: 10,
        fontWeight: "bold"
    },
    TotalText2: {
        color: "#6b7280ef",
        fontSize: 10,
        marginTop: 18,
        marginRight: 14,
        fontWeight: "bold"
    },
  
    SearchContainer: {
        display: "flex",
        flexDirection: "row",
        padding: 4,
        marginLeft: 17,
        marginTop: 20,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        marginRight: 17,
    
    },
    searchImg: {
        marginLeft: 9,
        marginTop: 6
    },
    SearchInput: {
        padding: 4,
        fontWeight: "bold",
        marginLeft: 2
    },
    filters: {
        display: "flex",
        flexDirection: "row",
        marginTop: 16,
        marginLeft: 17,
        elevation: 8,
        padding: 10
    },
    otherfilters:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        padding:2
    },
    Relevance: {
        display: "flex",
        flexDirection: "row",
        elevation: 3,
        borderRadius: 6,
        padding: 9,
        backgroundColor: "white",
        marginTop: 0,
        marginRight: 12,
        marginBottom: 4,
        paddingTop:10
    },
    RevanceActive: {
        backgroundColor: "#fef5f7",
        display: "flex",
        marginBottom: 3,
        flexDirection: "row",
        elevation: 3,
        borderRadius: 6,
        padding: 9,
        borderColor: "#e5d1d5",
        borderWidth: 1,
        paddingTop:10,
        marginRight: 10,
    },
    RelevanceText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 11,
        padding: 3
    },
    DropImg: {
        top: 0,
        right: 2
    },
    verified: {
        display: "flex",
        flexDirection: "row",
        elevation: 3,
        borderRadius: 6,
        padding: 8,
        backgroundColor: "white",
        marginTop: 3,
        marginBottom: 3,
       

    },
    VerifiedActive: {
        backgroundColor: "#fef5f7",
        display: "flex",
        flexDirection: "row",
        elevation: 3,
        borderRadius: 6,
        padding: 8,
        borderColor: "#e5d1d5",
        borderWidth: 1,
        marginTop: 3,
        marginBottom: 3,
        
      
    },
    commentcontainer: {
        display: "flex",
        flexDirection: "column",
        padding: 16,
        marginTop:3,
        backgroundColor:"white",
        justifyContent:"space-between"
        
    },
    commentheadingcontainer: {
        display: "flex",
        flexDirection: "row",
        padding: 5,
        justifyContent:"space-between"
    },
    commentnamecontainer: {
        display: "flex",
        flexDirection: "column",
        paddingLeft:8,
    },
    commentRatingcontainer: {
        display: "flex",
        flexDirection: "column",
        padding: 2,
        
    },
    commentButton: {
  backgroundColor: 'green', 
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 24, 
  alignSelf: 'center', 
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3, // for Android
  marginVertical: 15,
},
commentButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
},
commentButtonText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
  fontFamily: 'Your-Sans-Font', 
},
    commentName: {
        fontSize: 11.6,
        color: "black",
        fontWeight:"bold"
    },
    commentfollowers: {
        color: "#6b7280ef",
        fontSize: 10,
        marginTop:2.2,
        fontWeight:"bold"

    },
    commentverifiedtextcontainer:{
        display:"flex",
        flexDirection:"row",
        padding:3
    },
    commentverified: {
        color: "#6b7280ef",
        fontSize: 10,
        textDecorationLine: "underline"
    },
    RatingsContainer2: {
        display: "flex",
        backgroundColor: "green",
        borderRadius: 7,
        flexDirection: "row",
        padding: 3,
        marginLeft:40,
        marginRight:5
    },
    verifiedimg:{
        marginRight:2,
        marginTop:1
    },
    commentText:{
        fontSize: 13,
        color:"black",
        padding:5,
        paddingLeft:3,
        fontWeight:"bold"
    },
    commentText2:{
        fontSize: 10,
        color:"#6b7280ef",
        padding:5,
        paddingLeft:3,
        fontWeight:"bold",
        paddingTop:21
    },
    commenttabscontainer:{
        display:"flex",
        flexDirection:"row",
        backgroundColor:"white",
        justifyContent:"space-between",
        padding:5,
        paddingLeft:3,
        marginTop:2,
        marginBottom:3
    },
    commenttabbox:{
        display:"flex",
        flexDirection:"row",
        padding:5,
        paddingLeft:3,
        paddingRight:5
    },
    commenttabtext:{
        fontSize: 10.8,
        color:"black",
        fontWeight:"bold",
        paddingLeft:4,
        marginTop:4
    },
    likeimage:{
        paddingLeft:12,
    },
    LikeCommentCalculateContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    commentimgContainer:{
        marginTop:4,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    commentimg: {
        width: "100%",  
        height: undefined,
        aspectRatio: 1 / 1,
        resizeMode: "contain", 
        marginTop: 10
    }
});
export default ZomatoStyles;
