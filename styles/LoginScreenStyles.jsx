import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
  },
  eyeButton: {
    padding: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#e23845',
    borderColor: '#e23845',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
  },
  rememberMeText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
  },
  forgotPasswordLink: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#e23845',
  },
  submitButton: {
    backgroundColor: '#e23845',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: "outfit-medium",
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: "outfit-medium",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: '#333',
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupPromptText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
    marginRight: 5,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#e23845',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: "outfit-medium",
    marginBottom: 10,
  },
  // OTP Section Styles
  otpSection: {
    width: '100%',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#666',
    marginRight: 5,
  },
  resendLink: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: '#e23845',
    fontWeight: 'bold',
  },
  // Reset Password Section Styles
  resetPasswordSection: {
    width: '100%',
  },
});