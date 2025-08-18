import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
		marginTop: 16,
    backgroundColor: '#fff',
  },
  listItem: {
		flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
		justifyContent: 'space-between',
  },
  itemText: {
		fontFamily: 'outfit',
    fontSize: 16,
    color: '#333',
  },
	countryIcon: {
		height: 24,
		width: 24,
		marginRight: 10
	},
});