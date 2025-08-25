import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
  //   header: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     padding: 16,
  //     backgroundColor: '#fff',
  //     borderBottomWidth: 1,
  //     borderBottomColor: '#eee',
  //   },
  //   backButton: {
  //     marginRight: 16,
  //   },
  //   headerTitle: {
  //     fontSize: 24,
  //     fontWeight: '600',
  //     color: '#333',
  //   },
    ordersList: {
      padding: 16,
    },
    orderCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    restaurantSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    restaurantInfo: {
      flexDirection: 'row',
      flex: 1,
    },
    restaurantImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
    restaurantDetails: {
      flex: 1,
    },
    restaurantName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 4,
    },
    location: {
      fontSize: 14,
      color: '#666',
    },
    amount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginLeft: 8,
    },
    divider: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 16,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#666',
      marginBottom: 8,
    },
    itemsSection: {
      marginBottom: 16,
    },
    itemText: {
      fontSize: 14,
      color: '#333',
      marginBottom: 4,
    },
    orderInfoSection: {
      marginBottom: 16,
    },
    orderDateTime: {
      fontSize: 14,
      color: '#333',
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusText: {
      fontSize: 14,
      fontWeight: '500',
    },
    rejectedStatus: {
      color: '#e23744',
    },
    repeatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    repeatButtonText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 4,
    },
    tabContainer: {
  flexDirection: 'row',
  marginBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
tab: {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
},
activeTab: {
  borderBottomColor: '#fc8019',
},
tabText: {
  fontSize: 16,
  color: '#666',
},
activeTabText: {
  color: '#fc8019',
  fontWeight: '600',
},
  });
  export default styles;