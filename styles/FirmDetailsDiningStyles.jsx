import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: '#f8f7f7ff',
    paddingBottom: 20
	},
  imageContainer: {
    width: '100%',
    height: windowHeight * 0.40,
  },
  primaryImage: {
    width: '100%',
    height: '100%'
  },
  upperPannel: {
   position: 'absolute',
    top:  10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightPannel: {
    flexDirection: 'row',
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  bottomPannel: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
   
    alignItems: "center",
  },
  reviewBox: {
    // width:'30%',
    borderRadius: 10,
    marginTop:110,
    marginRight:10,
  },
  gradientOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  reviewBoxTopContainer: {
    backgroundColor: '#048520',
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  reviewBoxUpperContainer: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
  },
  reviewBoxBottomContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  subHeader: {
    fontFamily: 'outfit-bold',
    marginTop: 16,
    marginLeft: 10,
    fontSize: 20
  },
  reviewText: {
    fontFamily: 'outfit',
    color: 'white',
    fontSize: 15,
    marginRight: 7,
  },
  reviewCount: {
    fontFamily: 'outfit',
    fontSize: 12,
    textAlign: 'center',
    marginTop:4,
    color:"#333333"
  },
   reviewCount2: {
    fontFamily: 'outfit',
    fontSize: 12,
    textAlign: 'center',
    color:"#333333"
  },
  restaurantName: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    color: 'white',
  },
  restaurantAddress: {
    // width:'60%',
    width:250,
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#eee',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.63)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cuisines: {
    width:250,
    fontFamily: 'outfit',
    color: 'white',
    fontSize: 18
  },
  openingHrs: {
    // marginLeft: 2,
    fontFamily: 'outfit',
    fontSize: 16,
    color:"white",
    fontWeight:"400"
  },
  openingHrsBackground: {
    marginTop: 12,
   marginBottom:20,
    paddingHorizontal: 14,
    paddingVertical:7,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.71)",
    alignSelf: 'flex-start',
    flexDirection:"row",
    alignItems:"center"
  },

  price: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: 'white',
  },
  separatorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
	},
  line: {
    flex: 1,
    height: 0.4,
    backgroundColor: '#E03A48',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 14,
		color: '#444444',
    marginHorizontal: 7,
    fontWeight:700
	},
  buttonBar: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  button: {
    marginTop: 10,
    marginRight: 10, 
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:40,
    elevation:1,
    flex:1,
    padding:10,
  },
  button2: {
    marginTop: 10,
    marginRight: 10, 
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    elevation:1,
    padding:9,
    paddingLeft:20,
    paddingRight:20
  },
  buttonViewContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    marginLeft:10,
    position:"absolute",
    top:320,

  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    color: '#333333',
  },
  filterBox:{
    marginLeft:20,
    marginRight:20,
    borderRadius:30,
    padding:3,
    backgroundColor:"#F8F8FA",
    display:"flex",
    flexDirection:"row",
    marginTop:50,
    justifyContent:"space-between",
    display:"flex",
    flexDirection:"",
    borderWidth:1,
    borderColor:"#D9D9D9"

  },
  imageBoxContainer:{
    marginTop:10,
    marginRight:20,
    marginLeft:20,
    borderRadius:20,
    display:"flex",
  },
  imageBox:{
    height: undefined,
    aspectRatio: 9/12,
    width:100,
    borderRadius:10
  },
  filterValueText:{
    color:"#333333",
    fontWeight:"400",
    fontSize:13,
    marginRight:15,
    fontFamily:"outfit"
  },
  filterTextActive:{
    color:"#333333",
    fontWeight:"600",
    fontSize:13,
    fontFamily:"outfit"
  },
  ActiveFilterBox:{},

  filterActive:{
    backgroundColor:"white",
    borderWidth:1,
    borderRadius:18,
    borderColor:"#E03A48",
    paddingHorizontal:11,
    paddingVertical:5,
    justifyContent:"center",
    alignItems:"center"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    textAlign: "center",
  },
  guestControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  guestButton: {
    backgroundColor: "#e23845",
    borderRadius: 20,
    width: 40,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "outfit-bold",
  },
  guestCount: {
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
  proceedButton: {
    backgroundColor: "#e23845",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
  categoryContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  toggleIcon: {
    fontSize: 18,
  },
  galleryImage: { 
    width: '30%', 
    height: 100,  
    borderRadius: 10,
    marginLeft:10,
    marginTop:4
  },
  galleryOverlayContainer: { 
    position: 'relative', 
    width: '30%', 
    margin: 4
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  galleryOverlayText: { 
    color: '#fff', 
    fontSize: 16, 
    fontFamily: 'outfit-bold' 
  },
  openingHrsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  openingHrsModalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  openingHrsModalHeader: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
  },
  openingHrsModalText: {
    fontFamily: 'outfit',
    fontSize: 16
  },
  openingHrsCloseButton:{
    marginTop: 10,
    padding: 8,
    backgroundColor: '#e23845',
    borderRadius: 10
  },
  openingHrsCloseButtonText: {
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
})