import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: 'white'
  },
  upperPannel: {
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    paddingLeft: 20
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
  collectionImage: {
  height: 180,
  justifyContent: 'flex-end',
},
collectionImageStyle: {
  borderRadius: 8,
},
collectionOverlay: {
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  padding: 16,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
},
collectionTitle: {
  color: '#fff',
  fontSize: 24,
  fontWeight: 'bold',
},
restaurantlength: {
  color: '#fff',
  fontSize: 14,
  marginTop: 4,
},
arrowIcon: {
  marginLeft: 4,
},

})
