import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  pageHeader: {
    fontFamily: 'outfit-bold',
    fontSize: 25,
    marginTop:10
  },
  subHeader: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: 'gray'
  },
  upperPannel: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    paddingRight: 20,
    marginTop:10,
    marginLeft:10
  },
  pickerView: {
    marginTop: 20,
    flexDirection: 'row',
  },
  continueButton: {
    backgroundColor: '#e23845',
    padding: 10,
    borderRadius: 10,
    marginBottom:10
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 16
  },
  timeContainer: {
    marginBottom: 16
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "white",
  },
  activeTab: {
    backgroundColor: "#e23845",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "outfit",
  },
  activeTabText: {
    color: "white",
    fontFamily: "outfit-bold",
  },
  timeSlotsContainer: {
    display:"flex",
    padding:10
    },
  timeSlot: {
    // width: "50%",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    flex:1
  },
  selectedTimeSlot: {
    backgroundColor: "#e23845",
  },
  timeSlotText: {
    fontSize: 16,
    fontFamily: "outfit",
  },
  selectedTimeSlotText: {
    color: "white",
    fontFamily: "outfit-bold",
  },
  displayTab: {
    marginTop: 20
  },
  summaryType: {
    fontFamily: 'outfit',
    fontSize: 18,
    color: 'gray'
  },
  summaryValue: {
    fontFamily: 'outfit',
    fontSize: 20,
  },
  offerText: {
    fontSize: 12,
    color: "purple",
  },
  offersContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  offerHeader: {
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  offerSubHeader: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  offerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
    alignItems: "center",
  },
  offerTitle: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  offerSubtitle: {
    fontFamily:  'outfit',
    color: "gray",
    fontSize: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  selectedRadioCircle: {
    backgroundColor: '#e23845',
    borderColor: '#e23845',
  }
  
})