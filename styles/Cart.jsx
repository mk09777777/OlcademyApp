import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    listContent: {
      padding: 16,
    },
    cartItem: {
      flexDirection: 'row',
      padding: 12,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f5f5f5',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemDescription: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50',
      marginTop: 4,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantity: {
      fontSize: 16,
      marginHorizontal: 8,
    },
    removeButton: {
      padding: 8,
    },
    emptyCart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    emptyCartText: {
      fontSize: 16,
      color: '#666',
      marginTop: 8,
    },
    summary: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#f5f5f5',
      backgroundColor: '#fff',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#666',
    },
    summaryValue: {
      fontSize: 14,
      color: '#666',
    },
    totalRow: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#f5f5f5',
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4CAF50',
    },
    checkoutButton: {
      backgroundColor: '#4CAF50',
      padding: 16,
      margin: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cartButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#4CAF50',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30,
      elevation: 5,
    },
    cartButtonText: {
      color: 'white',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    cartBadge: {
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    cartBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    customizationDetails: {
      marginTop: 8,
      paddingLeft: 8,
      borderLeftWidth: 2,
      borderLeftColor: '#4CAF50',
    },
    customizationLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
  });
  export default styles;