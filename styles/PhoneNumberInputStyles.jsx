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
    borderRadius: 12,
    marginTop: "10%",
    backgroundColor: '#FFFFFF',
  },
  selectCountryCode: {
		marginTop: 25,
		marginRight: 7,
		paddingHorizontal: 10,
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: "center",
    alignItems: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		backgroundColor: '#FFFFFF',
	},
  countryIcon: {
		height: 24,
		width: 24,
		marginRight: 10
	},
  dialCode: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'outfit-medium',
  },
  phoneNumberInput: {
		letterSpacing: 2,
		fontSize: 16,
		fontFamily: 'outfit-medium',
		paddingVertical: 15,
		paddingHorizontal: 10,
		flex: 1,
		color: '#111827',
	},
})