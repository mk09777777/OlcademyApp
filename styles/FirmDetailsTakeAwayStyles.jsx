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
  rightPannel: {
    flexDirection: 'row',
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
  bottomPannel: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainPannel: {
    // Add main panel styles if needed
  },
  rightPannel : {
    flexDirection: 'row',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 0,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  itemImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 167.09,                       
    height: 171.67,                      
    borderTopLeftRadius: 11.44,          
    borderBottomLeftRadius: 11.44,       
    borderTopRightRadius: 0,             
    borderBottomRightRadius: 0,         
    resizeMode: "cover",                 
  },

  reviewBox: {
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
  price: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: 'white',
  },
  title: {
     width:200,
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold'
  },
  price: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    fontWeight: 'light-bold'
  },
  description: {
    width:200,
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666'
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
		color: '#ccc',
    fontFamily: "outfit-medium",
    marginHorizontal: 7
	},
  buttonBar: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  button: {
    marginTop: 10,
    marginRight: 20, 
    paddingVertical: 8,
    backgroundColor: '#e23845',
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    paddingHorizontal: 10,
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: 'white',
  },
  cartControls: {
    // flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cartButtonText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold',
  },
    addButton: {
  backgroundColor: '#ffffff',      
  borderWidth: 1,                  
  borderColor: '#e23845',          
  width: 149,                       
  height: 34,                       
  borderRadius: 6.87,               
  justifyContent: 'center',         
  alignItems: 'center',             
  marginBottom: 8,                  
  alignSelf: 'center',           // centers horizontally
  position: 'absolute',           // fixes it at the bottom
  bottom: 20,                     // distance from bottom
},

addButtonText: {
  color: '#e23845',                 // red text
  fontWeight: 'bold',
  fontSize: 16,
  fontFamily: "outfit-medium",
},

  proceedToCartButton: {
    backgroundColor: '#e23845',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  controlButton: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: '#e23845',
    paddingHorizontal: 10,
  },
  proceedToCartText: {
    fontFamily: 'outfit-bold',
    color: 'white',
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#e23845'
  },
  quantityText: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginHorizontal: 10,
    color: '#e23845'
  },
  offersContainer: {
  },
  offersHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  offersHeader: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    fontWeight: 'bold',
  },
  dropdownIcon: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
  },
  offersTrack: {
    paddingHorizontal: 10,
  },
  offerCard: {
    width: 200,
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between', 
},
  percentageOffer: {
    borderLeftWidth: 4,
    borderLeftColor: 'red',
  },
  flatOffer: {
    borderLeftWidth: 4,
    borderLeftColor: 'blue',
  },
  offerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  offerBadgeText: {
    fontSize: 10,
    fontFamily: "outfit",
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    fontWeight: '600',
    marginBottom: 5,
  },
  offerDiscount: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold',
    color: '#2a7f19',
    marginBottom: 5,
  },
  offerCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerCodeText: {
    fontSize: 12,
    fontFamily: "outfit",
    color: '#666',
  },
  offerCode: {
    fontSize: 12,
    fontFamily: "outfit",
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#2a7f19',
  },
  filterContainer: {
    
    marginHorizontal: 8,
    marginBottom: 10,
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
    fontFamily: "outfit-medium",
    fontFamily: 'outfit-medium',
  },
  
  selectedFilterButton: {
    backgroundColor: '#e23845',
  },
  selectedFilterText: {
    fontFamily: 'outfit',
    color: '#fff',
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModalContainer: {
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
  filterHeader: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#555",
    marginBottom: 8,
  },
  filterChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: "#e23845",
  },
  filterChipText: {
    color: "#333",
    fontFamily: 'outfit'
  },
  filterChipTextSelected: {
    color: "#FFF",
    fontFamily: "outfit-bold",
  },
  filterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterClearButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  filterClearButtonText: {
    color: "#FF5A5F",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  filterApplyButton: {
    backgroundColor: "#e23845",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterApplyButtonText: {
    color: "#FFF",
    fontSize: 16,
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
  diatryIcon: {
    marginTop: 5,
    width: 20,
    height: 20,
  },
  cuisineContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  offerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  offerModalContainer: {
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
  offerHeader: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  offerSubHeader: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#555",
    marginBottom: 8,
  },
  offerExpandedContent: {
    marginTop: 10,
  },
  offerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  offerDetailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  offerCloseButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#e23845',
    borderRadius: 10
  },
  offerCloseButtonText: {
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e23845',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  
})