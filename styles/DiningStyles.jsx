import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export const styles = StyleSheet.create({
  container: {
      flex: 1,
    backgroundColor: '#fff',
    padding:0
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  locationContainer: {
    flexDirection: 'row',
  },
  locationName: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
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
    fontSize:16,
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
  collectionContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 14,
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
    fontFamily: 'outfit-medium',
  },
  
  selectedFilterButton: {
    backgroundColor: '#e23845',
  },
  selectedFilterText: {
    fontFamily: 'outfit',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  categoryList: {
    width: "30%",
    borderRightWidth: 1,
    borderColor: "#ccc",
    padding: 8,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeCategory: {
    backgroundColor: "#e23845",
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#000",
  },
  activeCategoryText: {
    color: "#fff",
  },
  optionsList: {
    width: "70%",
    padding: 16,
  },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selectedOptionButton: {
    backgroundColor: "#e23845",
    borderRadius: 8,
  },
  selectedOptionText: {
    color: "#fff",
    fontFamily: 'outfit-medium',
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#f0ad4e",
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontFamily: "outfit-bold",
  },
  closeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e23845",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
  },
  collectionContainer: {
    padding: 10,
  },
  collectionCard: {
    // flex: 1,
    // marginLeft: 0,
    // margin: 10,
    // borderRadius: 10,
    // overflow: 'hidden',  
    marginHorizontal: 5,
    
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#b2babb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 140,
    marginBottom: 2,
  },
  collectionImage: {
   width: 160,
  height: 130,
  justifyContent: 'flex-end',  
  padding: 10, 
  borderRadius: 12,
  overflow: 'hidden',
  },
  collectionImageStyle: {
    borderRadius: 10,
  },
  collectionOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%'
  },
  collectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  restaurantlength:{
    color: '#fff',
  },
  
  campaignsContainer: {
    flexGrow: 0,
    overflow: 'hidden'
  },
   campaignsImage:{
    height: 0.18*windowHeight,
   },
  campaignsCard: {
    margin: 10,
    width: 0.85*windowWidth,
    height: 0.20*windowHeight,
    borderRadius: 10
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxHeight: 300,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  searchResultRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
})
