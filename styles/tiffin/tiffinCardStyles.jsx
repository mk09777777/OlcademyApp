import { StyleSheet } from 'react-native';

export const tiffinCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00796b',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#08a742',
  },
  trackButton: {
    backgroundColor: '#08a742',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
