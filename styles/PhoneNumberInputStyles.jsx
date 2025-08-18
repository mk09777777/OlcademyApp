import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  phoneNumberEntry: {
		flexDirection: 'row',
		marginTop: 5,
		marginHorizontal: 10,
		paddingHorizontal: 30,
		justifyContent: "center",
    alignItems: "center",
	},
  phoneNumberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: "10%"
  },
  selectCountryCode: {
		marginTop: 25,
		marginRight: 7,
		paddingHorizontal: 10,
		paddingVertical: 8,
		shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
		elevation: 1.5,
		flexDirection: 'row',
		justifyContent: "center",
    alignItems: "center",
		borderRadius: 4
	},
  countryIcon: {
		height: 24,
		width: 24,
		marginRight: 10
	},
  phoneNumberInput: {
		fontFamily: 'outfit-medium',
    letterSpacing: 4,
		fontSize: 16,
		padding: 15,
		flex: 1
	},
})