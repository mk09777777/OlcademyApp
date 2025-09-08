import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export  const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 20
  },
  imageContainer: {
    width: '100%',
    height: windowHeight * 0.4,
  },
  primaryImage: {
    width: '100%',
    height: '100%'
  },
  gradientOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  bottomDisplay: {
    position: 'absolute',
    bottom: 10
  },
  titleText: {
    fontFamily: 'outfit',
    fontSize: 26,
    fontFamily: 'outfit-bold ',
    color: 'white',
    paddingHorizontal: 10
  },
  eventTime: {
    paddingHorizontal: 10,
    fontFamily: 'outfit',
    fontSize: 18,
    fontFamily: 'outfit-bold ',
    color: 'white',
  },
  descriptionText: {
    fontFamily: 'outfit',
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    color: 'gray',
    paddingHorizontal: 10,
    marginTop: 15
  },
  readMore: {
    color: '#e23845',
    fontFamily: 'outfit-medium',
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    paddingHorizontal: 10
  },
  locatioText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginLeft: 20
  },
  propertyCard: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  propertyIcon: {
    color: '#e23845',
    padding: 5,
    backgroundColor: '#e2384533',
    borderRadius: 15,
    marginRight: 10,
  },
  locationIcon: {
    color: '#e23845',
  },
  locationButton: {
    alignSelf: 'flex-end'
  },
  propertyType: {
    fontFamily: 'outfit',
    color: 'gray',
    fontSize: 15,
    fontFamily: 'outfit-medium ',
  },
  propertyValue: {
    fontFamily: 'outfit',
    fontSize: 15
  }, 
  locationCard: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#e2384533',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingCard: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15
  },
  price: {
    fontFamily: 'outfit',
    fontSize: 23,
    fontFamily: 'outfit-bold ',

  },
  bookingButton: {
    backgroundColor: '#e23845',
    paddingHorizontal: 40,
    paddingVertical: 5,
    justifyContent: 'center',
    borderRadius: 10,
  },
  bookingButtonText: {
    fontFamily: 'outfit',
    fontSize: 23,
    fontFamily: 'outfit-bold ',
    color: 'white'
  },
  subHeading: {
    fontFamily: 'outfit',
    fontSize: 23,
    fontFamily: 'outfit-bold ',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  artistAvatar: {
    
  }
})