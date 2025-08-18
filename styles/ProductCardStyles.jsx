import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
  },
  diatryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: { 
    fontSize: 18, 
    fontFamily: 'outfit-bold'
  },
  price: { 
    fontSize: 16, 
    color: "#555", 
    fontFamily: 'outfit-medium'
  },
  description: { 
    fontSize: 14, 
    color: "#777", 
    fontFamily: 'outfit'
  },
  allergens: {
    paddingLeft: 10,
    fontFamily: 'outfit',
    fontSize: 16
  },
  image:{
    width: 100,
    height: 100,
    marginRight: 20,
  },
  diatryIcon: {
    marginTop: 5,
    width: 20,
    height: 20,
  }
});