import { Dimensions, StyleSheet } from "react-native"

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

 export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20

  },
  container1: {
    flex: 1
  },
  upperPannel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 25
  },
  separatorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
    marginBottom: 10
	  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
	separatorText: {
		fontFamily: 'outfit',
		fontSize: 14,
		color: '#ccc',
    marginHorizontal: 7
	},
  featuredContainer: {
    flexGrow: 0,
    overflow: 'hidden'
  },
  featuredCard: {
    paddingHorizontal: 10,
    width: 0.9*windowWidth,
    height: 0.25*windowHeight,
  },
  featured: {
    borderRadius: 10,
    flex: 1,
  },
  dateCardContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 10,
  },
  dateCard: {
    backgroundColor: 'white',
    width: 0.12*windowWidth,
    height: 0.055*windowHeight,
    borderRadius: 15,
    padding: 5
  },
  month: {
    fontFamily: 'outfit',
    fontSize: 14,
    textAlign: 'center',
    color: 'gray'
  },
  day: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    textAlign: 'center'
  },
  featuredCardBottom: {
    position: 'absolute',
    bottom: 10,
    paddingLeft: 10
  },
  featuredEventType: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#ccc'
  },
  featuredEventTitle: {
    fontFamily: 'outfit-meduim',
    fontSize: 20,
    color: 'white'
  },
  allShowsContainer: {
    flexGrow: 0,
    overflow: 'hidden'
  },
  allShowsCard: {
    flexDirection: 'row',
    padding: 10
  },
  allShowsImage: {
    width: 0.25*windowWidth,
    height: 0.1*windowHeight,
    borderRadius: 10
  },
  allShowsCardDetails:{
    justifyContent: 'center',
    padding: 20
  }, 
  allShowsCardTitle: {
    fontFamily: 'outfit-meduim',
    fontSize: 18,
  },
  allShowsCardType: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: 'gray',
  },
  allShowsCardDate: {
  fontFamily: 'outfit',
  fontSize: 14,
  }
 })