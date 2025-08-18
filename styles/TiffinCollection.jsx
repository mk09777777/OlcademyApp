import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  mainContainer: {
    paddingVertical: 8,
  },
  restaurantSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 12,
  },
  restaurantHeader: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  offerIcon: {
    marginLeft: 12,
    marginRight: 4,
  },
  offerText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  dishesContainer: {
    padding: 8,
  },
  dishDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  gapBox: {
    height: 16,
  },
  restaurantCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  restaurantInfo: {
    padding: 16,
  },
  timeDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeDistanceText: {
    color: '#666',
    fontSize: 14,
  },
  typePrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    color: '#666',
    fontSize: 14,
  },
  dotSeparator: {
    color: '#666',
    marginHorizontal: 8,
  },
  priceText: {
    color: '#666',
    fontSize: 14,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  offerContainer: {
    marginTop: 12,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 4,
  },
  dishCard: {
    flexDirection: 'row',
    padding: 16,
  },
  dishLeft: {
    flex: 1,
    paddingRight: 16,
  },
  dishRight: {
    alignItems: 'center',
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dishRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStars: {
    color: '#FFC107',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  customizableText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  vegIcon: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 4,
    padding: 2,
  },
  vegInner: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  }
});

export default styles;