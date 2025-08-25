import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 250,
    // position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal:10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  activeTab: {
    backgroundColor: '#ffe5e8',
    borderWidth: 1,
    borderColor: '#E41E3F',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#666',
  },
  activeTabText: {
    color: '#E41E3F',
    fontFamily: 'outfit-bold',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  collectionContainer: {
    padding: 16,
  },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width:'100%'
  },
  collectionImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  collectionContent: {
    padding: 16,
  },
  // Grid styles for collections
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  collectionImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  collectionContent: {
    padding: 12,
  },
  collectionTitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 4,
  },
  collectionInfo: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: '#666',
  },
  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  // Horizontal scroll container
  offersTrack: {
    paddingLeft: 16,
  },
  // Modal styles (if needed)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
});

export default styles;