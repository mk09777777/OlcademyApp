import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding:10
  },
  upperPannel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16
  },
  image: { 
    width: windowWidth * 0.3, 
    height: 100, 
    margin: 2, 
    borderRadius: 10 
  },
  firmName: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    paddingLeft: 20
  },
  price: {
    fontFamily: 'outfit',
    fontSize: 18,
    paddingLeft: 20
  }
})