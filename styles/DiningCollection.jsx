import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

// Define our own colors to avoid the missing Colors reference
const Colors = {
  primary: '#ff5252',
  primaryLight: '#ff8a80',
  background: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#777777',
  accent: '#ffbd00',
  success: '#4caf50'
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding:15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  firmList: {
    paddingBottom: 16,
  },
  // Empty Bookmark Card Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Collection Card Styles (commented out in component)
  collectionCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  collectionContent: {
    padding: 16,
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  collectionInfo: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  // Header Styles (if needed)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});