import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  modalHeader: {
 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
    menuItemImage: {
      marginTop:20,
    width: '100%',
    height:140,
  },

  // Scroll Content
  modalScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },

  // Meal Info
  mealInfo: {
       top:-30,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  mealPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },

  // Form Elements
  customizationForm: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },

  // Dropdowns
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  discountBadge: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '500',
  },

  // Calendar
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedRangeText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },

  // Calendar Modal
  calendarModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  calendarButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  calendarButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
  },
  calendarButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  datePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  datePreviewText: {
    fontSize: 16,
    color: '#333',
  },

  // Quantity Selector
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  quantityButton: {
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },

  // Price Summary
  priceBreakdown: {
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  priceBreakdownText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  discountText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 5,
  },

  // Selected Addons
  selectedAddonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedAddonBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAddonText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },

  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addonOption: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1.5,
  },
  addonLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Platform Specific Styles
  ...Platform.select({
    ios: {
      calendarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    android: {
      calendarContainer: {
        elevation: 3,
      },
    },
  }),
});

export default styles;