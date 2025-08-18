import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  userFollowers: {
    fontFamily: "outfit",
    fontSize: 12,
    color: "#555",
  },
  rating: {
    backgroundColor: "#28A745",
    padding: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: "#FFF",
    fontFamily: "outfit-bold",
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  restaurantDetails: {
    fontFamily: "outfit",
    fontSize: 12,
    color: "#555",
  },
  restaurantLocation: {
    fontFamily: "outfit",
    fontSize: 12,
    color: "#777",
  },
  reviewContent: {
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  reviewDate: {
    fontFamily: "outfit",
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 4,
    color: "#007BFF",
    fontFamily: "outfit-bold",
  },
  responseSection: {
    backgroundColor: "#E6F3FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  responseTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  responseText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  responseFooter: {
    fontFamily: "outfit",
    fontSize: 12,
    color: "#555",
  },
  responseDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  commentInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
    fontFamily: 'outfit'
  },
  submitButton: {
    margintTop: 10,
    backgroundColor: '#e23845',
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    color: 'white'
  }
});  