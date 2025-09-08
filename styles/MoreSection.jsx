import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: 10,
  },
  header: {
    padding: 15,
    fontFamily: "outfit-medium",
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.text,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
export default styles;