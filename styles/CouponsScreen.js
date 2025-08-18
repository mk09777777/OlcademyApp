import { Dimensions,StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  brand: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  offer: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 4,
  },
  expiry: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#f43f5e',
    borderRadius: 20,
    paddingVertical: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
 export default styles;