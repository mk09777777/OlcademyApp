import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        // *** CRITICAL CHANGE: Center the modal horizontally and vertically ***
        justifyContent: 'center', // Centers the modal vertically
        alignItems: 'center',     // Centers the modal horizontally
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay to dim the background
    },
    modalView: {
        backgroundColor: 'white', // Ensure the modal itself is opaque white
        width: '90%',             // Set to a percentage of screen width
        height: '80%',            // Set to a percentage of screen height (adjust as needed)
        
        // *** CRITICAL CHANGE: Use a single borderRadius for all corners ***
        borderRadius: 10,         // Rounded corners for the entire modal

        // Removed borderTopLeftRadius and borderBottomLeftRadius as it's no longer a sidebar
        
        padding: 20, // Consistent padding for content inside the modal

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden', // Ensures content respects rounded corners
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'space-between', // Distribute header, content, footer vertically
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    contentContainer: {
        flex: 1, // Takes up remaining vertical space
        flexDirection: 'row',
    },
    sidebar: {
        width: '35%', // Percentage of modal's width
        backgroundColor: '#f8f8f8',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        paddingVertical: 10,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    sidebarItemSelected: {
        backgroundColor: '#fff', // White background for selected item
        borderLeftWidth: 3,     // Red bar on the left for selected item
        borderLeftColor: '#e23845',
    },
    sidebarItemText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    sidebarItemTextSelected: {
        color: '#e23845', // Red text for selected item
        fontWeight: 'bold',
    },
    optionsContainer: {
        flex: 1, // Options pane takes remaining width
        padding: 15, // Padding inside the options pane
        backgroundColor: '#f8f8f8', // Retained for visual separation between sidebar and options
    },
    optionsContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, // Uses gap property for spacing (RN 0.71+)
    },
    chip: {
        margin: 4, // Fallback for older RN versions or additional spacing
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    chipText: {
        fontSize: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15, // Padding for the footer buttons area
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    resetButton: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e23845',
        justifyContent: 'center',
        minWidth: 100,
        flex: 1,
        marginRight: 10,
    },
    resetButtonText: {
        color: '#e23845',
        fontSize: 10,
         fontWeight: 'bold',
    },
    applyButton: {
        backgroundColor: '#e23845',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 25,
        justifyContent: 'center',
        minWidth: 150,
        flex: 1,
        marginLeft: 10,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyOptionsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 50,
    }
});