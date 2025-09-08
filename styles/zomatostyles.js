import { SortDescIcon } from 'lucide-react-native';
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
    modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  Height: '100%',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
commentsList: {
  // Height: '80%',
  marginBottom: 15,
},
commentItem: {
  marginBottom: 15,
  paddingBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
commentHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 5,
},
commentUsername: {
  fontWeight: 'bold',
  marginLeft: 8,
  marginRight: 10,
},
commentTime: {
  color: '#888',
  fontSize: 12,
},
repliesContainer: {
  marginLeft: 20,
  marginTop: 10,
},
replyItem: {
  marginBottom: 10,
},
replyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 3,
},
replyUsername: {
  fontWeight: 'bold',
  marginLeft: 6,
  marginRight: 8,
  fontSize: 14,
},
replyTime: {
  color: '#888',
  fontSize: 11,
},
replyText: {
  fontSize: 14,
  marginLeft: 22,
},
viewMoreButton: {
  marginTop: 5,
},
viewMoreText: {
  color: '#E91E63',
  fontSize: 14,
},
replyInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},
replyInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 8,
  marginRight: 10,
},
replyButton: {
  backgroundColor: '#E91E63',
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
},
replyButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
addCommentContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: '#eee',
  paddingTop: 15,
},
commentInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginRight: 10,
  maxHeight: 100,
},
noCommentsText: {
  textAlign: 'center',
  color: '#888',
  marginVertical: 20,
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
        marginLeft: 2,
        borderRadius: 7,
        flexDirection: "row",
        padding: 0,
        
    },
    RatingText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 11,
        marginLeft: 3,
    },
    RatingImg: {
      paddingLeft:2,
        
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
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor:  "#F2E8E8",
        flexDirection: "row",
        padding: 4,
        marginLeft: 17,
        marginTop: 20,
        elevation: 5,
        borderRadius: 10,
        
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
        marginTop: 0,
        marginRight: 4,
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
        
        borderColor: "#F2E8E8",
        borderWidth: 1,
        paddingTop:10,
        marginRight: 10,
    },
    RelevanceText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 11,
        padding: 3,
        backgroundColor: "#f2e8e8",
        borderRadius: 60,
        paddingLeft: 8,
        paddingRight: 8,
        marginLeft: 4
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
    commentMainContainer: {
      margin: 10,
      radius: 90,
    },
    commentcontainer: {
        display: "flex",
        flexDirection: "column",
        padding: 16,
        marginTop:3,
        backgroundColor:"white",
        justifyContent:"space-between",
        radius: 80,
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
        padding: 4,
        
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
        marginLeft:50,
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
        mmarginLeft: 10,
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
        marginLeft:10,
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
