import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    tabContainer: { flexDirection: 'row', marginBottom: 16 },
    tab: { flex: 1, padding: 10, borderBottomWidth: 2, borderColor: '#ccc' },
    activeTab: { borderColor: '#000' },
    tabText: { textAlign: 'center', color: '#757575' },
    activeTabText: { color: '#000', fontWeight: 'bold' },
    bookingsList: { marginTop: 16 },
    sectionTitle: { fontSize: 18, fontFamily: 'outfit-bold ', fontWeight: 'bold', marginBottom: 16 },
    loadingText: { fontSize: 16, fontFamily: 'outfit-medium ', textAlign: 'center', marginTop: 32 },
  });
  export default styles;