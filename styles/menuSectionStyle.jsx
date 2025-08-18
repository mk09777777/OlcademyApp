import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    padding: 16,
  },
  menuItem: {
    marginBottom: 16,
    // backgroundColor: '#fff',
    // elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  menuItemImageContainer: {
    width: 150,
    height:160,
  },
  menuItemImage: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  menuItemContent: {
    flex: 1,
    paddingHorizontal:20,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    bottom:15,
    left:10,
    // paddingBottom:10,
    borderRadius: 10,
    backgroundColor: '#FF4B3f',
    width:130,
    paddingHorizontal: 50,
    paddingVertical:4,
    height: 30,
  },
  addButtonc: {
    bottom:15,
    // left:10,
    // paddingBottom:10,
    borderRadius: 10,
    // backgroundColor: '#FF4B3f',
    // width:130,
    paddingHorizontal: 40,
    paddingVertical:5,
    height: 30,
  },
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
  },
  addButtonLabelc: {
    paddingBottom:10,
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
  backgroundColor: '#FF4B3A',
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
  bottom:10,

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
  paddingVertical:3,
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
});

export default styles;