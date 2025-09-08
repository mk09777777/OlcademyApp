import { StyleSheet } from "react-native";
import { colors } from "./Colors";
export const styles = StyleSheet.create({

    container: {
      backgroundColor: colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
    },
    image: {
      width: '100%',
      height: 200,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontFamily: 'outfit-bold ',
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    price: {
      fontSize: 18,
      fontFamily: 'outfit-bold ',
      fontWeight: '600',
      color: colors.primary,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      marginLeft: 8,
      color: colors.darkGray,
    },
    description: {
      marginVertical: 8,
      color: colors.text,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    tag: {
      backgroundColor: colors.lightGray,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      color: colors.darkGray,
      fontSize: 14,
      fontFamily: 'outfit-medium ',
    },
    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: colors.white,
      fontFamily: 'outfit-bold ',
      fontWeight: '600',
    },
  });