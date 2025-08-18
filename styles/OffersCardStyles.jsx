import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "#fff",
    borderColor: "gray",
    borderWidth: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontFamily: "outfit-bold",
    color: "#555",
    marginBottom: 4,
  },
  offerValidity: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: "#777",
  },
})