import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    fontWeight: 'bold',
    marginLeft: 20,
  },
  otpMessage: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  otpContainer: {
    marginBottom: 30,
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 50,
    width: 40,
  },
  pinCodeText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  focusStick: {
    backgroundColor: '#e23845',
    width: 2,
    height: 30,
  },
  activePinCodeContainer: {
    borderColor: '#e23845',
  },
  verifyButton: {
    backgroundColor: '#e23845',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold',
  },
  resendOtpContainer: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
    marginBottom: 5,
  },
  footerTxt: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
  },
  resendTxt: {
    color: '#e23845',
    textDecorationLine: 'underline',
  },
  disabledResend: {
    color: '#ccc',
    textDecorationLine: 'none',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});