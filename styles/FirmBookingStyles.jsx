import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  upperPannel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingRight: 16,
    marginRight: 8,
  },
  pageHeader: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 4,
  },
  subHeader: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#666',
  },
  
  // Calendar section
  calenderContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Tab section
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: "#e23845",
    borderColor: "#e23845",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: '#666',
  },
  activeTabText: {
    color: "white",
    fontFamily: "outfit-bold",
  },
  
  // Time slots section
  timeSlotsContainer: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  timeSlot: {
    width: "30%",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    paddingVertical: 12,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedTimeSlot: {
    backgroundColor: "#e23845",
    borderColor: "#e23845",
  },
  timeSlotText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#444',
  },
  selectedTimeSlotText: {
    color: "white",
    fontFamily: "outfit-bold",
  },
  noSlotsText: {
    textAlign: 'center', 
    marginTop: 20,
    fontFamily: 'outfit',
    color: '#666',
  },
  
  // Offers section
  offersContainer: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerHeader: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: '#333',
    marginBottom: 4,
  },
  offerSubHeader: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
    fontFamily: 'outfit',
  },
  offerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
    alignItems: "center",
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: '#e23845',
  },
  offerSubtitle: {
    fontFamily: 'outfit',
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },
  offerText: {
    fontSize: 11,
    color: "#e23845",
    marginTop: 4,
    fontFamily: 'outfit-medium',
  },
  
  // Continue button
  continueButton: {
    backgroundColor: '#e23845',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#e23845',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  headingText: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontFamily: 'outfit',
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  confirmButton: {
    backgroundColor: '#e23845',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  confirmText: {
    color: 'white',
    fontFamily: 'outfit-bold',
    fontSize: 16,
    textAlign: 'center',
  },
});