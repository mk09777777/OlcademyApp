import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    height: 200,
    justifyContent: 'flex-end', // push text to bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // dark overlay for contrast
  },
  contentContainer: {
    padding: 1,
  },
  titleContainer: {
  flexDirection: "row",       // places title on left & review box on right
  justifyContent: "space-between",
  alignItems: "flex-start",   // keeps title top-aligned with review box
  marginTop: 8,
  paddingHorizontal: 10,
},

title: {
  flex: 1,                    // take available width
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
  marginRight: 10,
  flexWrap: "wrap",
},
overlayContainer: {
  position: "absolute",
  bottom: 0,
  left: 10,
  right: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
},

titleWrapper: {
  flex: 1, // takes remaining space beside review box
  marginRight: 10,
},

titleText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
},
reviewBox: {
  marginTop: 20,
  bottom: 20,
  minWidth: 70,
  borderRadius: 10,
  right: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  overflow: 'hidden',   // ensures children match rounded corners
},

reviewBoxTopContainer: {
  backgroundColor: 'green',
  padding: 10,
},

reviewBoxBottomContainer: {
  backgroundColor: 'white',
  padding: 10,
  flexDirection: 'row',
},



reviewBoxUpperContainer: {
  flexDirection: "row",
  alignItems: "center",
},

reviewText: {
  fontSize: 14,
  color: "#fff",
  marginRight: 4,
},



reviewCount: {
  fontSize: 12,
  color: "#fff",
},



  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayContent: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroContainer: {
    height: 260,
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  heroTopBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  roundBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottomOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  heroMetaText: {
    color: '#eee',
    fontSize: 13,
  },
  ratingCard: {
    minWidth: 90,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  ratingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  ratingValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  ratingCount: {
    color: '#ddd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  
  reviewBoxUpperContainer: {
    flexDirection: 'row',
  },
  
  reviewText: {
    fontFamily: 'outfit',
    color: 'white',
    fontSize: 14,
    marginRight: 7,
  },
  reviewCount: {
    fontFamily: 'outfit',
    fontSize: 14,
    textAlign: 'center'
  },
  
  errorText: {
    fontSize: 18,
    color: '#FF4500',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#FF4500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
  contentContainer: {
    // bottom:90,
    // padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    // color:'#ffffffff',
    maxWidth: '80%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 14,
    lineHeight: 24,
  },
  descriptions: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#444',
    marginBottom: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    opacity: 1,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  TermsContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    // marginBottom: 10,
  },
  addOnModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addOnModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  addOnModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  addOnItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  addOnItemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  quantityButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  quantityText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addOnModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    borderColor: '#FF4B3A',
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 10,
  },
  menuImageContainer: {
    marginVertical: 10,
    padding: 16,
    // backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  // menuImage: {
  //   width: '100%',
  //   height: 200,
  //   borderRadius: 8,
  // },
  galleryContainer: {
    height: height * 0.2,
    width: width * 0.4,
    borderRadius: 20,
  },
  customizeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  customizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  cartBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flex: 2,
    // backgroundColor: '#f8f8f8',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#f0f0f0',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  vegFilterButton: {
    backgroundColor: '#4CAF50',
  },
  vegFilterButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  vegFilterText: {
    color: '#fff',
  },
  nonVegFilterButton: {
    backgroundColor: '#FF4B3A',
  },
  nonVegFilterButtonSelected: {
    backgroundColor: '#FF4B3A',
  },
  nonVegFilterText: {
    color: '#fff',
  },
  menuCategories: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonSelected: {
    backgroundColor: '#FF4B3A',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  menuList: {
    padding: 10,

  },
  menuItem: {
    marginBottom: 5,
    backgroundColor: '#f7f7f7ff',
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
    padding:5,
      borderColor:'#c1c1c1ff',
    borderWidth:0.5,
    borderRadius: 12,
    width: 370,
    height: 100,
  },
  menuItemImageContainer: {
    width: 120,
    height: 130,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderColor:'#424242ff',
    borderWidth:1,
    borderRadius: 12,
  },
  menuItemContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  imageBottomContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
  },
  menuItemHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4B3A',
    marginBottom: 8,
  },
  customizableText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: 12,
  },
  addButton: {
    bottom: 20,
    left: 250,
    // paddingBottom:10,
    borderRadius: 10,
    backgroundColor: '#02757A',
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 4,
    height: 30,
  },
  // addButtonc: {
  //   bottom: 15,
  //   // left:10,
  //   // paddingBottom:10,
  //   borderRadius: 10,
  //   // backgroundColor: '#FF4B3f',
  //   // width:130,
  //   paddingHorizontal: 40,
  //   paddingVertical: 5,
  //   height: 30,
  // },
  addButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 80,
  },
  addButtonLabel: {
    // paddingBottom:10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign:'center'
  },
  addButtonLabelc: {
    paddingBottom: 10,
    // color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  quantityText: {
    // bottom:10,
    color: '#000000',
    marginRight: 8,
    fontSize: 18,
  },
  vegIndicator: {
    marginRight: 6,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 2,
  },
  vegBadge: {
    position: 'absolute',
    left: 4,
    top: 3,
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#666',
  },
  // Add these new styles to your existing StyleSheet
  bottomCheckoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },
  checkoutButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#02757A',
    paddingVertical: 12,
    marginLeft: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  quantityControls: {
    bottom: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    // padding: 8,
  },
  customizeButton: {
    paddingHorizontal: 40,
    paddingVertical: 3,
    // borderColor: '#FF4B3A',
    // borderWidth: 1,
    // borderRadius: 8,
    // paddingVertical: 10,
    // marginRight: 8,
  },
  customizeButtonLabel: {
    color: '#FF4B3A',
    fontSize: 14,
  },
  checkoutTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  checkoutQuantity: {
    fontSize: 14,
    color: '#666',
  },
  customizeContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  customizeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  customizeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
  },
  customizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    color: '#e23845',
    paddingHorizontal: 10,
  },
  proceedToCartText: {
    fontFamily: 'outfit-bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  maincontainer: {
    backgroundColor: '#FFF',
    // borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    // bottom:100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // marginBottom: 12,
  },
  titleButton: {
    flex: 1,

  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  icon: {
    marginTop: 2,
    marginRight: 10,
  },

  deliveryCitiesContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  citiesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //  paddingHorizontal: 10,
    gap: 8,
  },
  cityPill: {
    backgroundColor: 'background: rgba(253, 231, 233, 1)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  cityText: {
    fontSize: 12,
    color: '#333',
  },
  togglePill: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreLessPill: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  moreLessText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
   offersContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  offerItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 20,
  },
  offerCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#27ae60',
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
    separatorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
    marginBottom: 5
	  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#353434ff',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 16,
		// color: '#ccc',
    marginHorizontal: 7
	},
});

export default styles;