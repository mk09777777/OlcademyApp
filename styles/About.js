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
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  subText: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: '#777',
  },
  versionText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#000',
    marginTop: 2,
    fontWeight: '600',
  },
});
export default styles;