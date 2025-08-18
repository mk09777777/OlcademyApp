import { Dimensions,StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    padding: 16,
  },
  messageBubble: {
    backgroundColor: '#e6f0ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  option: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  optionText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '500',
  },
});
export default styles;