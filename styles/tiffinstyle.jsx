import { StyleSheet, Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
export const COLORS = {
  PRIMARY: '#FF4B3A',
  SECONDARY: '#f5f5f5',
  TEXT_PRIMARY: '#333',
  TEXT_SECONDARY: '#666',
  BACKGROUND: '#fff',
  BORDER: '#f0f0f0',
  GRAY: 'gray',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding:20,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  // paddingLeft:20,
  //   paddingRight:20,
  //     paddingTop:20,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  topActionPannel: {
    flexDirection: 'row'
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
  profileButton: {
  //   position: 'relative',
  //   top: 0,
  //   right: 0,
  //   zIndex: 10,
   paddingTop: 10,
  },
  searchAndVegContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    minHeight: 0,
    // marginRight:30
    // Add horizontal padding to this container to give space on the sides
    // paddingHorizontal: 20, // This will apply padding to the search bar and veg filter
  },
  searchBarWrapper: {
    flex: 1, // This makes it take up available space
    marginRight: 0,
    // width: 300, // Remove this fixed width as it conflicts with flex: 1
  },
   vegFilterContainer: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent:"flex-start",
    marginLeft: 10,
  },  
  vegFilterText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'outfit-bold',
    color: '#333',
    textAlign: 'center',
    fontFamily: 'outfit',
    fontWeight: '500',
  },
   vegFilterText2: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'outfit',
    color: '#333',
    textAlign: 'center',
    fontFamily: 'outfit',
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
    fontFamily: 'outfit-bold',
    color:"black",
    fontWeight:"600",
        fontFamily: 'outfit',
    marginTop:15,

  },
  filterSection: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChipsContainer: {
    paddingVertical: 2,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 2,
    marginBottom: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 16,
    borderColor: '#e23845',
  },
  filterChipText: {
    fontSize: 10,
    fontFamily: 'outfit',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderColor: '#e23845',
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'outfit-medium',
    color: '#666',
  },
  sectionContainer: {
    marginVertical: 16,
    // paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
        fontFamily: 'outfit',
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#666',
    marginTop: 4,
  },
  viewAllButton: {
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'outfit',
    fontWeight: '600',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingIndicator: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  loadingTitle: {
    marginTop: 12,
    fontFamily: 'outfit-bold',
    fontSize: 16,
        fontFamily: 'outfit',
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  loadingSubtext: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'outfit-bold',
    fontSize: 16,
        fontFamily: 'outfit',
    color: COLORS.TEXT_PRIMARY,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
 line: {
    flex: 1,
    height: 1,
    backgroundColor: '#FF002E',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 13,
		color: '#222222',
    marginHorizontal: 7
	},
  sectionTitleText: {
    marginHorizontal: 10,
    fontFamily: 'outfit-medium',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 7,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#e23845',
  marginLeft: 10,
},
filterButtonText: {
  color: '#e23845',
  marginLeft: 5,
      fontFamily: 'outfit-bold',
  fontWeight: '500',
},
modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',
},
filterModalContainer: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: '80%',
},
filterModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
filterModalTitle: {
  fontSize: 20,
  fontFamily: 'outfit-bold',
  fontWeight: 'bold',
},
filterScrollView: {
  marginBottom: 20,
},
filterSection: {
  marginBottom: 20,
},
filterSectionTitle: {
  fontSize: 16,
  fontFamily: 'outfit-bold',
  fontWeight: '600',
  marginBottom: 10,
},
filterOption: {
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  marginBottom: 10,
},
activeFilterOption: {
  borderColor: '#e23845',
  backgroundColor: '#fce8ea',
},
filterOptionText: {
  fontSize: 14,
      fontFamily: 'outfit',
},
activeFilterOptionText: {
  color: '#e23845',
  fontWeight: '600',
},
filterModalFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},
clearFiltersButton: {
  padding: 15,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e23845',
  flex: 1,
  marginRight: 10,
  alignItems: 'center',
},
clearFiltersButtonText: {
  color: '#e23845',
  fontWeight: '600',
},
applyFiltersButton: {
  padding: 15,
  borderRadius: 10,
  backgroundColor: '#e23845',
  flex: 1,
  alignItems: 'center',
},
applyFiltersButtonText: {
  color: 'white',
  fontWeight: '600',
      fontFamily: 'outfit',
},
quickFiltersContainer: {
marginVertical:7,
},
// quickFiltersContent: {
//   // paddingHorizontal: 15,
//   paddingBottom: 5,
// },
// quickFilterButton: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   backgroundColor: '#f5f5f5',
//   borderRadius: 20,
//   paddingVertical: 6,
//   paddingHorizontal: 12,
//   marginRight: 8,
//   borderWidth: 1,
//   borderColor: '#ddd',
// },
activeQuickFilter: {
  backgroundColor: '#ffecec',
  borderColor: '#e23845',
},
quickFilterText: {
  marginLeft: 5,
  fontSize: 12,
  fontFamily: 'outfit',
  color: '#666',
},
activeQuickFilterText: {
  color: '#e23845',
  fontWeight: 'bold',
      fontFamily: 'outfit',
},
});

export default styles;


