import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // backgroundColor: '#f3f4f6' 
  },
  scroll: { 
    padding: 16, 
    paddingBottom: 100 
  },
  
  // Cart Summary Styles
  cartSummary: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyCartImage1: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 30,
    color: '#333',
  },
  quantityText: {
    fontSize: 20,
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 10,
  },

  // Card and general layout styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  info: { 
    flex: 1 
  },
  label: { 
    color: '#333', 
    fontSize: 14 
  },
  bold: { 
    fontWeight: 'bold' 
  },
  link: {
    color: '#444',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  address: { 
    color: '#666', 
    fontSize: 13 
  },
  striked: { 
    textDecorationLine: 'line-through', 
    color: '#999', 
    fontSize: 13 
  },
  boldPrice: { 
    color: '#111', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#e2ebfb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { 
    color: '#3c73d3', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  subLabel: { 
    color: '#888', 
    fontSize: 12, 
    marginTop: 2 
  },

  // Cancellation policy styles
  cancelTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  cancelText: {
    fontSize: 13,
    color: '#777',
    marginVertical: 6,
    lineHeight: 18,
  },

  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payUsing: {
    fontSize: 10,
    color: '#888',
  },
  payMethod: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  placeOrderBtn: {
    backgroundColor: '#e23744',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  picker: {
    color: '#1f2937',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(181, 181, 181, 0)',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickup: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#e23744',
    padding: 12,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Restaurant header styles
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  restaurantImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 6,
  },
  restaurantHeaderText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  // Location and time styles
  locationContainer: {
    flexDirection: 'row',
    paddingTop: 16,
  },
  locationDetails: {
    marginLeft: 8,
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationSubAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  icon: {
    marginTop: 2,
  },
  timeContainer: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  timeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleLink: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },

  // Schedule Modal Styles
  dateTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dateTab: {
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  dateTabSelected: {
    borderColor: '#e23744',
  },
  dateTabText: {
    fontWeight: 'normal',
    color: '#333',
  },
  dateTabTextSelected: {
    fontWeight: 'bold',
    color: '#e23744',
  },
  timeSlotsContainer: {
    maxHeight: 180,
    marginVertical: 10,
  },
  timeSlot: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#ffe8e8',
  },
  timeSlotText: {
    color: '#555',
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: '#e23744',
  },
  confirmButton: {
    backgroundColor: '#e23744',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    opacity: 1,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Bill Summary Modal Styles
  billSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  billRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    color: '#666',
    fontSize: 14,
  },
  billValue: {
    color: '#333',
    fontSize: 14,
  },
  billSubtext: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 'auto',
  },
  savingsContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  savingsText: {
    color: '#3c73d3',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e23744',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Promotion and Coupon Styles
  promotionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addPromoButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPromoButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  appliedPromoContainer: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedPromoText: {
    color: '#1890ff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
  },
  emoji: {
    fontSize: 20,
  },
  removePromoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePromoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllCouponsButton: {
    marginTop: 10,
  },
  viewAllCouponsText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
promoCard: {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 15,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
},
promoName: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
},
promoCode: {
  fontSize: 14,
  color: '#666',
  marginBottom: 5,
},
promoDiscount: {
  fontSize: 14,
  marginBottom: 5,
},
promoMinOrder: {
  fontSize: 12,
  color: '#666',
  marginBottom: 5,
},
promoDate: {
  fontSize: 12,
  color: '#666',
},
promoApplyButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 5,
  paddingHorizontal: 15,
  borderRadius: 4,
},
promoAppliedButton: {
  backgroundColor: '#2196F3',
},
promoApplyButtonText: {
  color: 'white',
  fontSize: 14,
},
  promoAppliedButton: {
    backgroundColor: '#28a745',
  },
  promoMinOrder: {
    fontSize: 12,
    color: '#666',
  },
  promoMaxDiscount: {
    fontSize: 12,
    color: '#666',
  },
});