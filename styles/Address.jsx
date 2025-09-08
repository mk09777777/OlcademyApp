import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 16,
    },
    addAddressButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addAddressText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'outfit',
      color: '#FF424F',
      marginLeft: 12,
    },
    savedSection: {
      flex: 1,
    },
    savedTitle: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'outfit',
      color: '#666',
      marginBottom: 16,
    },
    addressCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    addressTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressMeta: {
      marginLeft: 12,
    },
    addressType: {
      fontSize: 16,
      fontFamily: 'outfit',
      fontWeight: '500',
      color: '#333',
    },
    distance: {
      fontSize: 14,
      fontFamily: 'outfit',
      color: '#666',
    },
    addressText: {
      fontSize: 14,
      fontFamily: 'outfit',
      color: '#333',
      lineHeight: 20,
      marginBottom: 8,
    },
    phoneNumber: {
      fontSize: 14,
      fontFamily: 'outfit',
      color: '#666',
      marginBottom: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 8,
    },
    actionButton: {
      marginRight: 16,
      padding: 4,
    },
  });
  export default styles;