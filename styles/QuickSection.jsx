import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    quickActions: {
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'space-around',
    },
    quickActionItem: {
      flex: 1,
      padding: 15,
      backgroundColor: Colors.white,
      margin: 5,
      borderRadius: 8,
      alignItems: 'center',
    },
    viewActivityContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
      marginRight: 8, 
    },
    viewActivity: {
  
      fontSize: 16,
      color: '#000',
    },
  });
  export default styles;