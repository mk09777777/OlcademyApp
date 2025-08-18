import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
    },
    menuContainer: {
      marginTop: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuItemTitle: {
      fontSize: 16,
      color: '#333333',
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    menuItemValue: {
      fontSize: 14,
      color: '#666666',
      marginRight: 4,
    },
    percentageText: {
      color: '#4CAF50',
      fontWeight: '500',
    },
    starContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  export default styles;