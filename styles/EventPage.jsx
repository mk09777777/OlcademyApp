import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main Containers
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },

  // Headers and Tabs
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  mainTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeMainTab: {
    backgroundColor: '#E91E63',
  },
  activeSubTab: {
    backgroundColor: '#FCE4EC',
  },
  mainTabText: {
    fontSize: 15,
    fontFamily: 'outfit-medium ',
    fontWeight: '600',
    color: '#666666',
  },
  subTabText: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    fontWeight: '500',
    color: '#666666',
  },
  activeMainTabText: {
    color: '#FFFFFF',
  },
  activeSubTabText: {
    color: '#E91E63',
  },

  // Event Card Styles
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 16,
  },
  eventTypeContainer: {
    backgroundColor: '#F0F2F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  eventTypeText: {
    fontSize: 12,
    fontFamily: 'outfit ',
    fontWeight: '500',
    color: '#666666',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold ',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventInfoText: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    color: '#666666',
    marginLeft: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  // Modal Event Details
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: 20,
  },
  modalEventTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold ',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
  },

  // Live Indicator
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4A4A',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'outfit ',
    fontWeight: 'bold',
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  registeredButton: {
    backgroundColor: '#9C27B0',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    fontWeight: 'bold',
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Styles
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold ',
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'outfit-medium ',
    color: '#555555',
  },

  // Location Section
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'outfit-medium ',
    color: '#333333',
    marginLeft: 8,
  },
  mapButton: {
    backgroundColor: '#F0F2F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mapButtonText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    fontWeight: '600',
  },
  liveStreamButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  liveStreamButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },

  // Performer Styles
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  performerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  performerInitials: {
    fontSize: 18,
    fontFamily: 'outfit-bold ',
    fontWeight: 'bold',
    color: '#E91E63',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    fontWeight: 'bold',
    color: '#333333',
  },
  performerGenre: {
    fontSize: 14,
    color: '#666666',
  },
  performerAction: {
    padding: 8,
  },

  // Schedule Styles
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  scheduleTimeContainer: {
    width: 80,
    alignItems: 'center',
    position: 'relative',
  },
  scheduleTime: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    fontWeight: '500',
    color: '#E91E63',
    backgroundColor: '#FFFFFF',
    padding: 4,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    top: 24,
    bottom: -16,
    backgroundColor: '#EEEEEE',
    left: '50%',
    marginLeft: -1,
  },
  scheduleContent: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E91E63',
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    color: '#666666',
  },

  // Additional Info Styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'outfit-medium ',
    color: '#444444',
  },

  // Loading State
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'outfit-medium ',
    color: '#555',
  },

  // Attendee Info
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeCount: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    color: '#666666',
    marginLeft: 6,
  },

  // View Button
  viewButton: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewButtonText: {
    color: '#E91E63',
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    fontWeight: '600',
  },

  // Event Date
  eventDate: {
    fontSize: 14,
    fontFamily: 'outfit-medium ',
    color: '#EEEEEE',
    marginBottom: 8,
  },
});

export default styles;