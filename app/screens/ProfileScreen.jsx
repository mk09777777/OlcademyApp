import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../components/constants/Colors';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import BackRouting from "@/components/BackRouting";
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

const ProfileScreen = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
  const [userData, setUserData] = useState()
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  const [localProfile, setLocalProfile] = useState({
    name: '',
    email: '',
    profileImage: null,
    dob: new Date(),
    anniversary: new Date(),
    gender: 'Male',
    mobile: ''
  });
  const profileInitial = user?.username?.charAt(0).toUpperCase() || 'U';
  useEffect(() => {
    if (user) {
      setLocalProfile({
        name: user.username || user.displayName || '',
        email: user.email || '',
        profileImage: user.profilePic || null,
        dob: user.dob ? new Date(user.dob) : new Date(),
        anniversary: user.anniversary ? new Date(user.anniversary) : new Date(),
        gender: user.gender || 'Male',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const handleGetUserData = async () => {
    try {

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/user/profileData`, {
        withCredentials: true
      })
      const data = response.data
      setUserData(data)
      console.log("data fetched is", data)

    } catch (error) {
      console.error("error in getting user Data", error);
    }
  }

  useEffect(() => {
    handleGetUserData()
  }, [])

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (fieldToUpdate === 'dob' ? localProfile.dob : localProfile.anniversary);

    if (fieldToUpdate === 'dob') {
      setShowDobPicker(false);
      handleChange('dob', currentDate);
    } else {
      setShowAnniversaryPicker(false);
      handleChange('anniversary', currentDate);
    }
  };

  // http://192.168.0.106:3000/user/profileEdit

  const handleUpdateBackend = async () => {
    const uploadData = {
      username: localProfile.name,
      // email: localProfile.email,
      dateOfBirth: localProfile.dob.toISOString(),
      anniversary: localProfile.anniversary.toISOString(),
      gender: localProfile.gender,

    }
    try {
      await axios.post(`${API_CONFIG.BACKEND_URL}/user/profileEdit`,
        uploadData
        ,
        {
          withCredentials: true
        })
      console.log("data uploaded to server", uploadData)
    }
    catch (error) {
      console.log("error in uploading the user data", error);
    }
  }

  const handleUpdate = async () => {
    if (isEditing) {
      const updatedProfile = {
        ...user,
        displayName: localProfile.name,
        username: localProfile.name,
        email: localProfile.email,
        profilePicture: localProfile.profileImage,
        dob: localProfile.dob.toISOString(),
        anniversary: localProfile.anniversary.toISOString(),
        gender: localProfile.gender,
        mobile: localProfile.mobile
      };

      try {
        await handleUpdateBackend();

        await AsyncStorage.setItem('userData', JSON.stringify(updatedProfile));
        console.log('Profile updated locally:', updatedProfile);

        // ✅ Re-fetch the updated data from server
        await handleGetUserData();

      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }

    setIsEditing(!isEditing);
  };



  return (
    <View style={styles.container}>
          <BackRouting  />  
      {/* Header with Profile Image */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>{profileInitial}</Text>

            </View>
          )}
          {/* <FontAwesome6 name="edit" size={20} color="red" style={styles.editIon} /> */}
        </View>


        {/* Name Field */}
        <View style={styles.DetailsContainer}>
          <View style={styles.labelContainer}>
            <AntDesign name="user" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Name</Text>
          </View>
          <View style={styles.fieldContainer}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={localProfile.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            ) : (
              <Text style={styles.value}>{localProfile.name || 'Not set'}</Text>
            )}
          </View>
          <View style={styles.divider} />

          {/* Email Field */}
          <View style={styles.labelContainer}>
            <Fontisto name="email" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Email</Text>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.row}>
             
                <Text style={styles.value}>{localProfile.email || 'Not set'}</Text>
              
            </View>
          </View>
          <View style={styles.divider} />

          {/* Mobile Field */}
          <View style={styles.labelContainer}>
            <Ionicons name="call-outline" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Mobile</Text>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.row}>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.flex1]}
                  value={localProfile.mobile}
                  onChangeText={(text) => handleChange('mobile', text)}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.value}>{localProfile.mobile || 'Not set'}</Text>
              )}
            </View>
            {isEditing && (
              <TouchableOpacity onPress={() => handleChange('mobile', '')}>
                <Text style={styles.changeText}>CLEAR</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.divider} />

          {/* Date of Birth Field */}
          <View style={styles.labelContainer}>
            <Fontisto name="date" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Date of birth</Text>
          </View>
          <View style={styles.fieldContainer}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.flex1}
                onPress={() => {
                  setFieldToUpdate('dob');
                  setShowDobPicker(true);
                }}
              >
                <Text style={styles.value}>{formatDate(localProfile.dob)}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.value}>{formatDate(localProfile.dob)}</Text>
            )}
            {showDobPicker && (
              <DateTimePicker
                value={localProfile.dob}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.divider} />

          {/* Anniversary Field */}
          <View style={styles.labelContainer}>
            <Fontisto name="date" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Anniversary</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.value}>{formatDate(localProfile.anniversary)}</Text>
            {showAnniversaryPicker && (
              <DateTimePicker
                value={localProfile.anniversary}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.divider} />

          {/* Gender Field */}
          <View style={styles.labelContainer}>
            <AntDesign name="user" size={18} color="#f04f5f" style={styles.labelImage} />
            <Text style={styles.label}>Gender</Text>
          </View>
          {isEditing ? (
            <View style={styles.radioContainer}>
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => handleChange('gender', 'Male')}
              >
                <View style={styles.radioCircle}>
                  {localProfile.gender === 'Male' && <View style={styles.selectedRadio} />}
                </View>
                <Text style={styles.radioLabel}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => handleChange('gender', 'Female')}
              >
                <View style={styles.radioCircle}>
                  {localProfile.gender === 'Female' && <View style={styles.selectedRadio} />}
                </View>
                <Text style={styles.radioLabel}>Female</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => handleChange('gender', 'Other')}
              >
                <View style={styles.radioCircle}>
                  {localProfile.gender === 'Other' && <View style={styles.selectedRadio} />}
                </View>
                <Text style={styles.radioLabel}>Other</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fieldContainer}>
              <Text style={styles.value}>{localProfile.gender || 'Not set'}</Text>
            </View>
          )}
          <View style={styles.divider} />
        </View>


        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>
            {isEditing ? 'SAVE PROFILE' : 'UPDATE PROFILE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#e0e0e0',
    marginTop: 10
  },
  editIon: {
    position: "absolute",
    top: 110,
    left: 220
  },
  DetailsContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 20
  },
  // divider: {
  //   height: 1,
  //   backgroundColor: '#e0e0e0',
  //   marginVertical: 12,
  // },
  fieldContainer: {
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#aeb2b8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5
  },
  labelContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    alignContent: "center"
  },
  label: {
    fontSize: 14,
    color: '#aeb2b8',
    marginBottom: 4,
    fontWeight: '400',
    marginLeft: 8,
    marginTop: 10
  },
  labelImage: {
    marginLeft: 10,
    marginTop: 5
    // marginRight:8,
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: -85,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 80,
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  changeText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#f04f5f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  radioContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 10,
  marginBottom: 10,
  padding: 8,
},
radioButton: {
  flexDirection: 'row',
  alignItems: 'center',
},
radioCircle: {
  height: 20,
  width: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#f04f5f',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 5,
},
selectedRadio: {
  height: 10,
  width: 10,
  borderRadius: 5,
  backgroundColor: '#f04f5f',
},
radioLabel: {
  fontSize: 16,
  color: '#000',
},
});

export default ProfileScreen;