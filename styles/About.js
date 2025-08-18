import { Dimensions,StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemNoChevron: {
    justifyContent: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#777',
  },
  versionText: {
    fontSize: 16,
    color: '#000',
    marginTop: 2,
    fontWeight: '600',
  },
});
export default styles;