import { StyleSheet } from "react-native";
const styles=StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      formContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#E41E3F',
      },
      inputGroup: {
        marginBottom: 15,
      },
      inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
      },
      buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      button: {
        flex: 1,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
      },
      cancelButton: {
        backgroundColor: '#f1f1f1',
      },
      submitButton: {
        backgroundColor: '#E41E3F',
      },
      cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
      },
      submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    });
    
export default styles;