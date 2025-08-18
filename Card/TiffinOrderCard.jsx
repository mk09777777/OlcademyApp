import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TiffinOrderCard = ({ booking, onPress }) => {
  const getStatusColor = (status) => ({
    active: '#08a742',
    pending: '#f57c00',
    completed: '#2196f3',
    cancelled: '#e53935'
  })[status] || '#757575';

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return 'checkmark-circle';
      case 'pending': return 'time-outline';
      case 'completed': return 'flag-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const options = { day: 'numeric', month: 'short' };
    
    if (!endDate) return start.toLocaleDateString('en-IN', options);
    
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.typeAndStatus}>
          <View style={[styles.typeChip, 
            booking.type === 'One Day' ? styles.oneDayChip : 
            booking.type === 'Weekly' ? styles.weeklyChip : styles.monthlyChip
          ]}>
            <Text style={styles.typeText}>{booking.type}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={getStatusIcon(booking.status)} 
              size={16} 
              color={getStatusColor(booking.status)}
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.dateRange}>
          {formatDateRange(booking.startDate, booking.endDate)}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant-outline" size={20} color="#757575" />
          <Text style={styles.infoText}>{booking.menu}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color="#757575" />
          <Text style={styles.infoText}>{booking.meals.join(' & ')}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceText}>₹{booking.price.totalAmount}</Text>
        </View>
        
        {booking.status === 'active' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Track Today's Meal</Text>
          </TouchableOpacity>
        )}
        
        {booking.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, styles.pendingButton]}>
            <Text style={[styles.actionButtonText, styles.pendingButtonText]}>Pay Now</Text>
          </TouchableOpacity>
        )}
        
        {booking.status === 'completed' && (
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Renew Plan</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      marginBottom: 14,
    },
    typeAndStatus: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    typeChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    oneDayChip: {
      backgroundColor: '#e3f2fd',
    },
    weeklyChip: {
      backgroundColor: '#e8f5e9',
    },
    monthlyChip: {
      backgroundColor: '#fff3e0',
    },
    typeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#555',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIcon: {
      marginRight: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    dateRange: {
      fontSize: 13,
      color: '#757575',
    },
    cardContent: {
      marginBottom: 14,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#333',
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceContainer: {
      
    },
    priceLabel: {
      fontSize: 12,
      color: '#757575',
    },
    priceText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#333',
    },
    actionButton: {
      backgroundColor: '#ff5722',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    actionButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 13,
    },
    pendingButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#f57c00',
    },
    pendingButtonText: {
      color: '#f57c00',
    },
    secondaryButton: {
      backgroundColor: '#e0e0e0',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    secondaryButtonText: {
      color: '#616161',
      fontWeight: '600',
      fontSize: 13,
    }
  });
  export default TiffinOrderCard;