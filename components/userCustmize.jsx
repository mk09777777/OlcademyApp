import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
} from 'react-native';
import { Chip, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const UserCustomize = ({ visible, onClose, onSubmit }) => {
  const pricing = {
    base: 80,
    itemTypes: {
      mainCourse: { basePrice: 30, nonVegPremium: 15 },
      breads: { basePrice: 10 },
      rice:{basePrice: 20},
      sides: { basePrice: 5 },
      desserts: { basePrice: 15 }
    },
    preferences: { specialInstructions: 5 }
  };

  const [customTiffin, setCustomTiffin] = useState({
    name: '',
    components: { mainCourse: [], breads: [], rice: [], sides: [], desserts: [] },
    preferences: { spiceLevel: '', oil: '', salt: '' },
    specialInstructions: '',
    deliverySchedule: { frequency: 'daily', days: [], timeSlot: '' }
  });

  const [price, setPrice] = useState(pricing.base);
  const [userDefinedItems, setUserDefinedItems] = useState({
    mainCourse: { name: '', isVeg: true },
    breads: { name: '' },
    rice:{name:''},
    sides: { name: '' },
    desserts: { name: '' }
  });

  const options = {
    spiceLevels: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
    oilOptions: ['Less Oil', 'Normal', 'Extra'],
    saltOptions: ['Less Salt', 'Normal', 'Extra'],
    frequencies: ['Daily', 'Weekly', 'Alternate Days'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['8-10 AM', '12-2 PM', '7-9 PM']
  };

  useEffect(() => { calculatePrice(); }, [customTiffin]);

  const calculatePrice = () => {
    let total = pricing.base;
    Object.keys(customTiffin.components).forEach(category => {
      customTiffin.components[category].forEach(item => {
        if (category === 'mainCourse') {
          total += pricing.itemTypes.mainCourse.basePrice;
          if (!item.isVeg) total += pricing.itemTypes.mainCourse.nonVegPremium;
        } else total += pricing.itemTypes[category].basePrice;
      });
    });
    if (customTiffin.specialInstructions) total += pricing.preferences.specialInstructions;
    setPrice(total);
  };

  const addCustomItem = (category) => {
    const itemName = userDefinedItems[category].name.trim();
    if (!itemName) return;
    const newItem = { name: itemName, isVeg: category === 'mainCourse' ? userDefinedItems.mainCourse.isVeg : true };
    setCustomTiffin(prev => {
      const newComponents = {...prev.components};
      if (category === 'mainCourse' && newComponents[category].length >= 2) {
        alert('Maximum selection reached');
        return prev;
      }
      newComponents[category].push(newItem);
      return { ...prev, components: newComponents };
    });
    setUserDefinedItems(prev => ({ ...prev, [category]: { name: '', isVeg: true } }));
  };

  const removeItem = (category, index) => {
    setCustomTiffin(prev => {
      const newComponents = {...prev.components};
      newComponents[category].splice(index, 1);
      return { ...prev, components: newComponents };
    });
  };

  const handleSave = () => {
    const customMeal = {
      id: 'tiffin-' + Date.now(),
      name: customTiffin.name || 'Custom Tiffin',
      price,
      description: 'Customized tiffin meal',
      isVeg: !customTiffin.components.mainCourse.some(item => !item.isVeg),
      customizationDetails: customTiffin
    };
    onSubmit(customMeal);
    onClose();
  };

  const renderItemSection = (category, label) => (
    <View className="mb-5">
      <Text className="text-base font-semibold mb-2">{label}</Text>

      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-3 text-base"
          value={userDefinedItems[category].name}
          onChangeText={(text) => setUserDefinedItems({
            ...userDefinedItems,
            [category]: { ...userDefinedItems[category], name: text }
          })}
          placeholder={`Enter ${category} item`}
        />
        {category === 'mainCourse' && (
          <View className="flex-row ml-2">
            <Chip
              mode={userDefinedItems.mainCourse.isVeg ? 'flat' : 'outlined'}
              onPress={() => setUserDefinedItems({...userDefinedItems, mainCourse: {...userDefinedItems.mainCourse, isVeg: true}})}
              style={{ marginRight: 5 }}
            >Veg</Chip>
            <Chip
              mode={!userDefinedItems.mainCourse.isVeg ? 'flat' : 'outlined'}
              onPress={() => setUserDefinedItems({...userDefinedItems, mainCourse: {...userDefinedItems.mainCourse, isVeg: false}})}
            >Non-Veg</Chip>
          </View>
        )}
        <Button mode="outlined" onPress={() => addCustomItem(category)} className="ml-2 border-green-600 text-green-600">
          Add
        </Button>
      </View>

      {customTiffin.components[category].length > 0 && (
        <View className="mt-2">
          {customTiffin.components[category].map((item, index) => (
            <View key={index} className="flex-row justify-between items-center p-2 bg-gray-100 rounded-lg mb-2">
              <Text className="text-sm">
                {item.name} {category === 'mainCourse' && `(${item.isVeg ? 'Veg' : 'Non-Veg'})`}
              </Text>
              <TouchableOpacity onPress={() => removeItem(category, index)}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} className="m-0 justify-end">
      <View className="bg-white rounded-t-2xl max-h-[90%] p-5">
        <ScrollView>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold">Customize Your Tiffin</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold mb-2">Name Your Tiffin (Optional)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              value={customTiffin.name}
              onChangeText={(text) => setCustomTiffin({...customTiffin, name: text})}
              placeholder="E.g., My Favorite Combo"
            />
          </View>

          {renderItemSection('mainCourse', 'Main Course (Add 1-2 items)')}
          {renderItemSection('breads', 'Breads (Add 1-2 items)')}
          {renderItemSection('rice', 'Rice (Add 1-2 items)')}
          {renderItemSection('sides', 'Sides (Optional)')}
          {renderItemSection('desserts', 'Desserts (Optional)')}

          <View className="flex-row justify-between items-center my-5 py-3 border-y border-gray-200">
            <Text className="text-base font-semibold">Total Price:</Text>
            <Text className="text-lg font-bold text-green-600">₹{price}</Text>
          </View>

          <TouchableOpacity onPress={handleSave} className="bg-green-600 rounded-lg py-3 mb-4">
            <Text className="text-white text-center font-bold text-base">Place Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default UserCustomize;


/* ---------------- OLD STYLESHEET (COMMENTED OUT) ----------------
const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20
  },
  ...
});
------------------------------------------------------------------ */
