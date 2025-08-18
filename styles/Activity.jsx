import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 24, // To balance the back button
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#fff',
    // borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
   profileHeader: {
      alignItems: 'center',
      padding: 10,
    },
    headerBackground: {
      width: '100%',
      height: 180,
      borderRadius: 10,
      overflow: 'hidden',
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
   avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#E8F0FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -85,
      borderWidth: 3,
      borderColor: '#fff',
      elevation: 3,
    },
    avatarText: {
      fontSize: 32,
      color: '#1A73E8',
    },
     username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 5,
    },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  placeImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  rating: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  actionButtonTextActive: {
    color: '#FF3B30',
  },
  photoItem: {
    flex: 1,
    margin: 5,
    // aspectRatio: 1,
  },
  photoImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  photoGrid: {
    padding: 5,
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  blogExcerpt: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  blogDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyActionButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;