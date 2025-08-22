import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const BookingCard = ({ booking, onPress, Rname, add, guestes, name, date, timeSlot, status, image }) => {
  const statusColor = status === 'accepted' ? '#08a742' : '#e53935';
  const statusText = status === 'confirmed' ? 'Booking confirmed' : 'Booking cancelled';

  // Format date to dd/mm/yy with validation
  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };
  
  const formattedDate = formatDate(date);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={typeof image === 'string' ? { uri: image } : image}
          style={styles.image}
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{Rname}</Text>
          <Text style={styles.location}>{add}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bookingInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Guest:</Text>
          <Text style={styles.value}>{guestes}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.dateTime}>
          {timeSlot}, {formattedDate}
        </Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  restaurantInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#757575',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  bookingInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#757575',
    width: 80,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BookingCard;
