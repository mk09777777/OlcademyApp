import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  locationContainer: {
    flexDirection: 'row',
  },
  topActionPannel: {
    flexDirection: 'row'
  },
  locationName: {
    fontFamily: 'outfit-medium',
    fontSize: 40,
  },
  locationAddress: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: 'gray'
  },
  offerBanner: {
    marginTop: 20,
    width: '100%',
    height: 270,
    borderRadius: 10,
  },
  searchAndVegContainer: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    minHeight: 0,
    // Add horizontal padding to this container to give space on the sides
    // paddingHorizontal: 20, // This will apply padding to the search bar and veg filter
  },
  searchBarWrapper: {
    flex: 1, // This makes it take up available space
    marginRight: 0,
    // width: 300, // Remove this fixed width as it conflicts with flex: 1
  },
  searchBar: {
    paddingLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    // width: 50, // <--- Remove or significantly increase this fixed width
    // If you remove it, searchBar will naturally fill the searchBarWrapper's width.
    // If you need a specific width, ensure it's large enough, e.g.,
    // width: '80%', // Example: 80% of its parent's available width
    // width: 250, // Example: a fixed larger pixel width
  },
   vegFilterContainer: {
    margin: 0,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent:"flex-start"
  },  
  vegFilterText: {
    // marginLeft: 10, // If you uncomment this, it adds space from the icon
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
   vegFilterText2: {
    // marginLeft: 10, // If you uncomment this, it adds space from the icon
    fontSize: 12,
    fontWeight: '900',
    color: '#333',
    marginBottom:0
  },
  // veg On Modal
  VegBack:{
    backgroundColor:"#ffff",
    alignContent:"center",
    justifyContent:"center",
    alignItems:"center",
    flex:1
  },
  VegImg:{
    width:90,
    height:90,
  },
  VegText:{
    fontSize:18,
    color:"black",
    fontWeight:"600",
    marginTop:15,
},
  //Turn off modal
  modalBackground:{
        backgroundColor:"rgba(0, 0, 0, 0.53)",
        display:"flex",
        justifyContent:"center",
        flex:1
  },
  modalV:{
    backgroundColor:"#ffff",
    borderRadius:10,
    flexDirection:"column",
    marginRight:10,
    padding:10,
    marginLeft:20,
    marginRight:20,
    alignItems:"center"
    
  },
  closeButton:{
    padding:10,
    marginLeft:10,
    marginRight:10,
    backgroundColor:"red",
    borderRadius:7,
    marginTop:10,
    justifyContent:"center",
    alignItems:"center",
    
  },
   KeepUsingButton:{
    padding:10,
    marginLeft:10,
    marginRight:10,
    backgroundColor:"white",
    borderRadius:7,
    marginTop:10,
    justifyContent:"center",
    alignItems:"center",
    
  },
  imageView:{
    marginTop:10,
    justifyContent:"center",
    alignItems:"center"
  },
  imageE:{
    height:70,
    width:70
  },
  separatorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		
    marginBottom: 10
	  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 16,
		color: '#ccc',
    marginHorizontal: 7
	},
  filterContainer: {
    marginBottom: 10
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e23845',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: windowHeight * 0.35,
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
  modalTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#e23845",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  radioText: {
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
  proceedButton: {
    backgroundColor: "#e23845",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 60
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  cuisinesList: {
    paddingVertical: 5
  },
  checkBoxIcon: { 
    borderColor: "#e23845", 
    borderWidth: 2 
  },
  checkBoxText: {
    textDecorationLine: "none",
    fontSize: 20,
    fontFamily: 'outfit-medium',
    color: "#333",
  },
  checkBoxContainer: {
    height: '65%',
    paddingBottom: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#e23845',
  },
  selectedFilterText: {
    fontFamily: 'outfit',
    color: '#fff',
  },
  featuredContainer: {
    flexGrow: 0,
    overflow: 'hidden'
  },
  featuredCard: {
    paddingHorizontal: 10,
    width: 0.9*windowWidth,
    height: 0.25*windowHeight,
  },
  featured: {
    borderRadius: 10,
    flex: 1,
  },
  featuredCardBottom: {
    position: 'absolute',
    bottom: 10,
    paddingLeft: 10
  },
  featuredEventType: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#ccc'
  },
  featuredEventTitle: {
    fontFamily: 'outfit-meduim',
    fontSize: 20,
    color: 'white'
  },
  mindScrollContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
  },
  mindCard: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  mindImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  mindTitle: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginTop: 8,
    textAlign: 'center',
  },
  mindSeparator: {
    width: 10,
  },
})