import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { filterStyles } from '../styles/tiffin/filterStyles';

const FilterModal = ({ visible, onClose, onApply }) => {
  const [filters, setFilters] = useState({ status: '', mealType: '' });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={filterStyles.modalContainer}>
        <View style={filterStyles.modalContent}>
          <View style={filterStyles.modalHeader}>
            <Text style={filterStyles.modalTitle}>Filter Orders</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <ScrollView>
            <Text style={filterStyles.filterLabel}>Status</Text>
            {['All', 'Active', 'Pending', 'Completed'].map(status => (
              <TouchableOpacity
                key={status}
                style={[filterStyles.filterOption, filters.status === status && filterStyles.filterOptionActive]}
                onPress={() => setFilters({ ...filters, status })}
              >
                <Text style={[filterStyles.filterOptionText, filters.status === status && filterStyles.filterOptionTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={filterStyles.applyButton} onPress={() => onApply(filters)}>
            <Text style={filterStyles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
