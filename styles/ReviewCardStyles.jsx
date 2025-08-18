import { StyleSheet, Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    width: windowWidth * 0.65,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  date: {
    fontSize: 12,
    color: "#gray",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#gray",
  },
  readMore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e23845",
  },
  readLess: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e23845",
    marginTop: 5,
  },
})