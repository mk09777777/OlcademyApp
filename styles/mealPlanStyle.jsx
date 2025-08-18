import { StyleSheet } from 'react-native';

const createStyles = (theme = {}) => {
  const {
    primaryColor = '#FF4500',
    successColor = '#4CAF50',
    backgroundColor = '#fff',
    textColor = '#333',
    borderColor = '#eee',
  } = theme;

  return StyleSheet.create({
    planCard: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      backgroundColor: backgroundColor,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    planTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
    },
    planDescription: {
      fontSize: 14,
      color: '#666',
      maxWidth: '70%',
    },
    priceBreakdown: {
  marginTop: 20,
  padding: 16,
  borderRadius: 10,
  backgroundColor: '#f9f9f9',
  borderWidth: 1,
  borderColor: '#eaeaea',
},
priceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},
priceLabel: {
  fontSize: 14,
  color: '#666',
},
priceValue: {
  fontSize: 14,
  color: '#333',
  fontWeight: '500',
},
discountValue: {
  color: '#4CAF50',
},
totalRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#eaeaea',
},
totalLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},
totalValue: {
  fontSize: 16,
  fontWeight: '600',
  color: '#4CAF50',
},
    planImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 16,
    },
    planPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: primaryColor,
    },
    planDuration: {
      fontSize: 16,
      color: '#666',
      marginLeft: 4,
    },
    savingsBadge: {
      backgroundColor: successColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    savingsText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    mealsContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 8,
    },
    mealItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    mealText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#666',
    },
    featuresContainer: {
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#666',
    },
    subscribeButton: {
      backgroundColor: primaryColor,
      paddingVertical: 8,
      borderRadius: 8,
    },
    subscribeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
};

export default createStyles;
