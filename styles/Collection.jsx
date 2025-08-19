import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  activeTab: {
    backgroundColor: '#ffe5e8',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#666',
  },
  activeTabText: {
    color: '#E41E3F',
  },
  searchContainer: {
   padding: 2,
    paddingLeft: 20,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  cardWrapper: {
    width: '48%', // leaves a small gap between cards
    marginBottom: 15,
  },
  collectionTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginHorizontal:10,
    marginVertical:5,
    marginBottom: 4,
  },
  collectionInfo: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
    marginHorizontal:10,
    marginBottom: 10,
  },
  createNewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E41E3F',
    borderStyle: 'dashed',
  },
  createNewText: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#E41E3F',
    marginLeft: 8,
  },
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 12,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontFamily: 'outfit-medium',
  },
  submitButton: {
    backgroundColor: '#E41E3F',
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'outfit-medium',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 200,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
    textAlign: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E41E3F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  offerText: {
    fontSize: 12,
    fontFamily: 'outfit-medium',
    color: '#fff',
  },
  firmList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  firmCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  firmImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  firmContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  firmName: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 4,
  },
  firmType: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#E41E3F',
    marginRight: 8,
  },
  reviews: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: '#999',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  }
});

export default styles;
