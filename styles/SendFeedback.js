import {Dimensions, StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backArrow: {
    fontSize: 2,
    color: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#5a6175',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#d32f2f',
    height: 40,
    marginBottom: 30,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 30,
  },
  helpIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  helpDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
export default styles;