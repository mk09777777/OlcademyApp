import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';
import { Chip, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const UserCustomize = ({ visible, onClose, onSubmit }) => {
  // Base pricing structure
  const pricing = {
    base: 80, // Base price for a standard tiffin
    itemTypes: {
      mainCourse: { basePrice: 30, nonVegPremium: 15 },
      breads: { basePrice: 10 },
      rice:{basePrice: 20},
      sides: { basePrice: 5 },
      desserts: { basePrice: 15 }
    },
    preferences: {
      specialInstructions: 5 
    }
  };

  const [customTiffin, setCustomTiffin] = useState({
    name: '',
    components: {
      mainCourse: [],
      breads: [],
      rice:[],
      sides: [],
    
      desserts: []
    },
    preferences: {
      spiceLevel: '',
      oil: '',
      salt: ''
    },
    specialInstructions: '',
    deliverySchedule: {
      frequency: 'daily',
      days: [],
      timeSlot: ''
    }
  });

  const [price, setPrice] = useState(pricing.base);
  const [userDefinedItems, setUserDefinedItems] = useState({
    mainCourse: { name: '', isVeg: true },
    breads: { name: '' },
    rice:{name:''},
    sides: { name: '' },
    desserts: { name: '' }
  });

  // Available options
  const options = {
    spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
    oilOptions: ['Less Oil', 'Normal', 'Extra'],
    saltOptions: ['Less Salt', 'Normal', 'Extra'],
    frequencies: ['Daily', 'Weekly', 'Alternate Days'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['8-10 AM', '12-2 PM', '7-9 PM']
  };

  // Calculate price whenever customization changes
  useEffect(() => {
    calculatePrice();
  }, [customTiffin]);

  const calculatePrice = () => {
    let total = pricing.base;
    
    // Calculate price for all selected items
    Object.keys(customTiffin.components).forEach(category => {
      customTiffin.components[category].forEach(item => {
        if (category === 'mainCourse') {
          total += pricing.itemTypes.mainCourse.basePrice;
          if (!item.isVeg) {
            total += pricing.itemTypes.mainCourse.nonVegPremium;
          }
        } else {
          total += pricing.itemTypes[category].basePrice;
        }
      });
    });
    
    // Additional charge for special instructions
    if (customTiffin.specialInstructions) {
      total += pricing.preferences.specialInstructions;
    }
    
    setPrice(total);
  };

  const addCustomItem = (category) => {
    const itemName = userDefinedItems[category].name.trim();
    if (!itemName) return;

    const newItem = {
      name: itemName,
      isVeg: category === 'mainCourse' ? userDefinedItems.mainCourse.isVeg : true
    };

    setCustomTiffin(prev => {
      const newComponents = {...prev.components};
      
      // For main course, limit to 2 selections
      if (category === 'mainCourse' && newComponents[category].length >= 2) {
        Alert.alert('Maximum selection', 'You can select only 2 main course items');
        return prev;
      }
      
      newComponents[category].push(newItem);
      
      return {
        ...prev,
        components: newComponents
      };
    });

    // Clear the input
    setUserDefinedItems(prev => ({
      ...prev,
      [category]: { name: '', isVeg: true }
    }));
  };

  const removeItem = (category, index) => {
    setCustomTiffin(prev => {
      const newComponents = {...prev.components};
      newComponents[category].splice(index, 1);
      return {
        ...prev,
        components: newComponents
      };
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (customTiffin.components.mainCourse.length === 0) {
      Alert.alert('Selection required', 'Please add at least one main course item');
      return;
    }
    
    if (!customTiffin.preferences.spiceLevel) {
      Alert.alert('Selection required', 'Please select your spice level preference');
      return;
    }
    
    if (!customTiffin.deliverySchedule.timeSlot) {
      Alert.alert('Selection required', 'Please select a delivery time slot');
      return;
    }
    
    if (customTiffin.deliverySchedule.frequency === 'weekly' && 
        customTiffin.deliverySchedule.days.length === 0) {
      Alert.alert('Selection required', 'Please select at least one delivery day for weekly schedule');
      return;
    }

    const customMeal = {
      id: 'tiffin-' + Date.now(),
      name: customTiffin.name || 'Custom Tiffin',
      price: price,
      description: 'Customized tiffin meal',
      isVeg: !customTiffin.components.mainCourse.some(item => !item.isVeg),
      customizationDetails: customTiffin
    };
    
    onSubmit(customMeal);
    onClose();
    
    // Reset form after submission
    setCustomTiffin({
      name: '',
      components: {
        mainCourse: [],
        breads: [],
        rice:[],
        sides: [],
        desserts: []
      },
      preferences: {
        spiceLevel: '',
        oil: '',
        salt: ''
      },
      specialInstructions: '',
      deliverySchedule: {
        frequency: 'daily',
        days: [],
        timeSlot: ''
      }
    });
    setPrice(pricing.base);
    setUserDefinedItems({
      mainCourse: { name: '', isVeg: true },
      breads: { name: '' },
      rice:{name:''},
      sides: { name: '' },
      desserts: { name: '' }
    });
  };

  const renderItemSection = (category, label, maxItems = 2) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        
        {/* Input for new item */}
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.nameInput, styles.flexGrow]}
            value={userDefinedItems[category].name}
            onChangeText={text => setUserDefinedItems({
              ...userDefinedItems,
              [category]: {
                ...userDefinedItems[category],
                name: text
              }
            })}
            placeholder={`Enter ${category} item`}
          />
          
          {category === 'mainCourse' && (
            <View style={styles.vegNonVegContainer}>
              <Chip
                mode={userDefinedItems.mainCourse.isVeg ? 'flat' : 'outlined'}
                selected={userDefinedItems.mainCourse.isVeg}
                onPress={() => setUserDefinedItems({
                  ...userDefinedItems,
                  mainCourse: {
                    ...userDefinedItems.mainCourse,
                    isVeg: true
                  }
                })}
                style={styles.vegNonVegChip}
                selectedColor="#4CAF50"
              >
                Veg
              </Chip>
              <Chip
                mode={!userDefinedItems.mainCourse.isVeg ? 'flat' : 'outlined'}
                selected={!userDefinedItems.mainCourse.isVeg}
                onPress={() => setUserDefinedItems({
                  ...userDefinedItems,
                  mainCourse: {
                    ...userDefinedItems.mainCourse,
                    isVeg: false
                  }
                })}
                style={styles.vegNonVegChip}
                selectedColor="#FF5722"
              >
                Non-Veg
              </Chip>
            </View>
          )}
          
          <Button 
            mode="outlined" 
            onPress={() => addCustomItem(category)}
            style={styles.addButton}
            labelStyle={styles.addButtonText}
          >
            Add
          </Button>
        </View>
        
        {/* Display selected items */}
        {customTiffin.components[category].length > 0 && (
          <View style={styles.selectedItemsContainer}>
            {customTiffin.components[category].map((item, index) => (
              <View key={index} style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>
                  {item.name} 
                  {category === 'mainCourse' && ` (${item.isVeg ? 'Veg' : 'Non-Veg'})`}
                  {category === 'mainCourse' && (
                    <Text style={styles.priceText}>
                      {` - ₹${item.isVeg ? 
                        pricing.itemTypes.mainCourse.basePrice : 
                        pricing.itemTypes.mainCourse.basePrice + pricing.itemTypes.mainCourse.nonVegPremium}`}
                    </Text>
                  )}
                  {category !== 'mainCourse' && (
                    <Text style={styles.priceText}>
                      {` - ₹${pricing.itemTypes[category].basePrice}`}
                    </Text>
                  )}
                </Text>
                <TouchableOpacity onPress={() => removeItem(category, index)}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {/* Price info */}
        <Text style={styles.priceInfo}>
          {category === 'mainCourse' ? (
            `Base price: ₹${pricing.itemTypes.mainCourse.basePrice} (Veg), ₹${pricing.itemTypes.mainCourse.basePrice + pricing.itemTypes.mainCourse.nonVegPremium} (Non-Veg)`
          ) : (
            `Base price: ₹${pricing.itemTypes[category].basePrice}`
          )}
        </Text>
      </View>
    );
  };

  return (
    <Modal 
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <ScrollView>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Customize Your Tiffin</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} />
            </TouchableOpacity>
          </View>
          
          {/* Tiffin Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Name Your Tiffin (Optional)</Text>
            <TextInput
              style={styles.nameInput}
              value={customTiffin.name}
              onChangeText={text => setCustomTiffin({...customTiffin, name: text})}
              placeholder="E.g., My Favorite Combo"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Main Course Selection */}
          {renderItemSection('mainCourse', 'Main Course (Add 1-2 items)')}
          
          {/* Breads Selection */}
          {renderItemSection('breads', 'Breads (Add 1-2 items)')}
          {renderItemSection('rice', 'Rice (Add 1-2 items')}
          {/* Sides Selection */}
          {renderItemSection('sides', 'Sides (Optional)')}
          
          {/* Desserts Selection */}
          {renderItemSection('desserts', 'Desserts (Optional)')}
          
          <Divider style={styles.divider} />
          
          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Preferences</Text>
            
            <Text style={styles.subSectionLabel}>Spice Level (Required)</Text>
            <View style={styles.chipContainer}>
              {options.spiceLevels.map(level => (
                <Chip
                  key={level}
                  mode={customTiffin.preferences.spiceLevel === level ? 'flat' : 'outlined'}
                  selected={customTiffin.preferences.spiceLevel === level}
                  onPress={() => setCustomTiffin({
                    ...customTiffin, 
                    preferences: {
                      ...customTiffin.preferences,
                      spiceLevel: level
                    }
                  })}
                  style={styles.chip}
                  selectedColor="#4CAF50"
                >
                  {level}
                </Chip>
              ))}
            </View>
            
            <Text style={styles.subSectionLabel}>Oil Preference (Optional)</Text>
            <View style={styles.chipContainer}>
              {options.oilOptions.map(option => (
                <Chip
                  key={option}
                  mode={customTiffin.preferences.oil === option ? 'flat' : 'outlined'}
                  selected={customTiffin.preferences.oil === option}
                  onPress={() => setCustomTiffin({
                    ...customTiffin, 
                    preferences: {
                      ...customTiffin.preferences,
                      oil: option
                    }
                  })}
                  style={styles.chip}
                  selectedColor="#4CAF50"
                >
                  {option}
                </Chip>
              ))}
            </View>
            
            <Text style={styles.subSectionLabel}>Salt Preference (Optional)</Text>
            <View style={styles.chipContainer}>
              {options.saltOptions.map(option => (
                <Chip
                  key={option}
                  mode={customTiffin.preferences.salt === option ? 'flat' : 'outlined'}
                  selected={customTiffin.preferences.salt === option}
                  onPress={() => setCustomTiffin({
                    ...customTiffin, 
                    preferences: {
                      ...customTiffin.preferences,
                      salt: option
                    }
                  })}
                  style={styles.chip}
                  selectedColor="#4CAF50"
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.instructionsInput}
              multiline
              numberOfLines={3}
              value={customTiffin.specialInstructions}
              onChangeText={text => setCustomTiffin({
                ...customTiffin, 
                specialInstructions: text
              })}
              placeholder="Any special requests or allergies?"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Delivery Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Delivery Schedule</Text>
            
            <Text style={styles.subSectionLabel}>Frequency (Required)</Text>
            <View style={styles.chipContainer}>
              {options.frequencies.map(freq => (
                <Chip
                  key={freq}
                  mode={customTiffin.deliverySchedule.frequency === freq.toLowerCase() ? 'flat' : 'outlined'}
                  selected={customTiffin.deliverySchedule.frequency === freq.toLowerCase()}
                  onPress={() => setCustomTiffin({
                    ...customTiffin, 
                    deliverySchedule: {
                      ...customTiffin.deliverySchedule,
                      frequency: freq.toLowerCase(),
                      days: freq.toLowerCase() === 'weekly' ? customTiffin.deliverySchedule.days : []
                    }
                  })}
                  style={styles.chip}
                  selectedColor="#4CAF50"
                >
                  {freq}
                </Chip>
              ))}
            </View>
            
            {customTiffin.deliverySchedule.frequency === 'weekly' && (
              <>
                <Text style={styles.subSectionLabel}>Delivery Days (Required)</Text>
                <View style={styles.chipContainer}>
                  {options.days.map(day => (
                    <Chip
                      key={day}
                      mode={customTiffin.deliverySchedule.days.includes(day) ? 'flat' : 'outlined'}
                      selected={customTiffin.deliverySchedule.days.includes(day)}
                      onPress={() => {
                        const newDays = [...customTiffin.deliverySchedule.days];
                        const index = newDays.indexOf(day);
                        
                        if (index >= 0) {
                          newDays.splice(index, 1);
                        } else {
                          newDays.push(day);
                        }
                        
                        setCustomTiffin({
                          ...customTiffin, 
                          deliverySchedule: {
                            ...customTiffin.deliverySchedule,
                            days: newDays
                          }
                        });
                      }}
                      style={styles.chip}
                      selectedColor="#4CAF50"
                    >
                      {day}
                    </Chip>
                  ))}
                </View>
              </>
            )}
            
            <Text style={styles.subSectionLabel}>Time Slot (Required)</Text>
            <View style={styles.chipContainer}>
              {options.timeSlots.map(slot => (
                <Chip
                  key={slot}
                  mode={customTiffin.deliverySchedule.timeSlot === slot ? 'flat' : 'outlined'}
                  selected={customTiffin.deliverySchedule.timeSlot === slot}
                  onPress={() => setCustomTiffin({
                    ...customTiffin, 
                    deliverySchedule: {
                      ...customTiffin.deliverySchedule,
                      timeSlot: slot
                    }
                  })}
                  style={styles.chip}
                  selectedColor="#4CAF50"
                >
                  {slot}
                </Chip>
              ))}
            </View>
          </View>
          
          {/* Price Summary */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Price:</Text>
            <Text style={styles.priceValue}>₹{price}</Text>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={styles.saveButtonText}
          >
            Place Order
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  subSectionLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    marginTop: 12
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#e0e0e0'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4
  },
  chip: {
    margin: 4
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef'
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600'
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745'
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 10
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  flexGrow: {
    flex: 1
  },
  addButton: {
    marginLeft: 10,
    borderColor: '#28a745'
  },
  addButtonText: {
    color: '#28a745'
  },
  selectedItemsContainer: {
    marginTop: 10
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8
  },
  selectedItemText: {
    fontSize: 14
  },
  priceText: {
    fontWeight: 'bold',
    color: '#28a745'
  },
  priceInfo: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5
  },
  vegNonVegContainer: {
    flexDirection: 'row',
    marginLeft: 10
  },
  vegNonVegChip: {
    marginRight: 5,
    height: 32
  }
});

export default UserCustomize;