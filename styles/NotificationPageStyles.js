import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const NotificationpageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  itemContainer: {
    overflow: 'hidden',
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    width: 80,
    height: '100%',
    backgroundColor: '#e23744',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});


export default NotificationpageStyles;