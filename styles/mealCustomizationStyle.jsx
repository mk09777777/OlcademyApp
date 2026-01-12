import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },

  // Image
  ItemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  // Scroll Content
  modalScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },

  // Meal Info
  // mealInfo: {
  //   padding: 20,
  //   borderRadius: 12,
  //   backgroundColor: '#fff',
  //   marginVertical: 16,
  //   borderWidth: 1,
  //   borderColor: '#eaeaea',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 4,
  //   elevation: 2,
  // },
  // mealName: {
  //   fontSize: 20,
fontFamily: "outfit-bold",
  //   fontWeight: '700',
  //   color: '#333',
  //   marginBottom: 8,
  // },
  planDurationText: {
    fontSize: 14,

    fontFamily: "outfit-medium",
    color: '#666',
    fontWeight: '500',
  },

  // Form Elements
  customizationForm: {
  },
  formGroup: {
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 16,
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
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
    fontSize: 14,
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
    color: '#4CAF50',
    marginTop: 8,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedRangeText: {
    fontSize: 14,
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
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
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  calendarButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  calendarButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
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
    fontWeight: '600',
    fontSize: 16,
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
  },
  datePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  datePreviewText: {
    fontSize: 16,
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
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
    padding: 14,
    backgroundColor: '#f9f9f9',
  },
  quantityText: {
    fontSize: 16,
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },

  // Price Summary
  priceBreakdown: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    fontFamily: "outfit-medium",
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  discountText: {
    marginTop: 5,
    fontSize: 15,
    fontFamily: "outfit-medium",
    color: '#4CAF50',
    textAlign: 'center',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 18,
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
    marginTop: 8,
  },

  // Selected Addons
  selectedAddonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  selectedAddonBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAddonText: {
    fontSize: 13,
    fontFamily: "outfit",
    color: '#2E7D32',
    fontWeight: '500',
  },

  // Time Slots
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  timeSlotButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  timeSlotSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeSlotText: {
    color: '#333',
    fontSize: 14,
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },

  // Addons
  addonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addonOption: {
    width: '48%',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
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
fontFamily: "outfit-bold",
    fontFamily: "outfit-medium",
    color: '#333',
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
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
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
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
fontFamily: "outfit-medium",
    fontFamily: "outfit-medium",
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
    mealContainer: {
    flexDirection: 'row',
    marginTop:10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor:'#151515ff',
    borderWidth:1,
    marginRight: 20,
  },
  mealInfo: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 18,
fontFamily: "outfit-bold",
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  mealPrice: {
    fontSize: 16,
fontFamily: "outfit-medium",
    fontWeight: '600',
    marginBottom: 8,
    color: '#2ecc71',
  },
  planDurationText: {
    fontSize: 14,
fontFamily: "outfit-bold",
    color: '#7f8c8d',
  },
  mealDescription: {
    fontSize: 14,
fontFamily: "outfit-bold",
    color: '#666',
    lineHeight: 20,
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