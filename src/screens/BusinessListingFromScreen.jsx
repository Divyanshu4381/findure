import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import * as mime from 'react-native-mime-types';
import { useNavigation } from '@react-navigation/native';

const AddBusiness = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessDescription: '',
    phoneNumber: '',
    businessCategory: '',
    businessType: '',
    experience: '',
    openTime: '',
    closeTime: '',
    latitude: '',
    longitude: ''
  });
  const [businessImage, setBusinessImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories] = useState([
    'Restaurant',
    'Retail',
    'Service',
    'Manufacturing',
    'Healthcare',
    'Technology',
    'Education',
    'Construction',
    'Entertainment',
    'Other'
  ]);
  const [types] = useState([
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
    'LLC',
    'Franchise'
  ]);

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setBusinessImage({
          uri: selectedImage.uri,
          name: selectedImage.fileName || `business-${Date.now()}`,
          type: mime.lookup(selectedImage.uri) || 'image/jpeg',
        });
      }
    });
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.businessName || !formData.businessAddress || !formData.businessDescription || 
        !formData.phoneNumber || !formData.businessCategory || !formData.businessType || 
        !formData.experience || !formData.openTime || !formData.closeTime || 
        !formData.latitude || !formData.longitude || !businessImage) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Validate coordinates
    if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('businessAddress', formData.businessAddress);
      formDataToSend.append('businessDescription', formData.businessDescription);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('businessCategory', formData.businessCategory);
      formDataToSend.append('businessType', formData.businessType);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('openTime', formData.openTime);
      formDataToSend.append('closeTime', formData.closeTime);
      formDataToSend.append('location', JSON.stringify({
        type: "Point",
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
      }));
      formDataToSend.append('businessImage', {
        uri: businessImage.uri,
        name: businessImage.name,
        type: businessImage.type,
      });

      const response = await axios.post(`${API_BASE_URL}/api/v1/business`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${await AsyncStorage.getItem('accessToken')}`
        },
      });

      if (response.data) {
        Alert.alert('Success', 'Business registered successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Business registration failed';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized - Please login again';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.heading}>Register Your Business</Text>

        {/* Business Image */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleImagePick}
          activeOpacity={0.7}
        >
          {businessImage ? (
            <Image source={{ uri: businessImage.uri }} style={styles.businessImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera-outline" size={32} color="#94a3b8" />
              <Text style={styles.imageText}>Add Business Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Business Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter business name"
            value={formData.businessName}
            onChangeText={(text) => handleChange('businessName', text)}
          />
        </View>

        {/* Business Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full address"
            value={formData.businessAddress}
            onChangeText={(text) => handleChange('businessAddress', text)}
            multiline
          />
        </View>

        {/* Business Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Description *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Describe your business"
            value={formData.businessDescription}
            onChangeText={(text) => handleChange('businessDescription', text)}
            multiline
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Business Category */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessCategory}
              onValueChange={(itemValue) => handleChange('businessCategory', itemValue)}
              style={styles.picker}
              dropdownIconColor="#94a3b8"
            >
              <Picker.Item label="Select category" value="" />
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Business Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessType}
              onValueChange={(itemValue) => handleChange('businessType', itemValue)}
              style={styles.picker}
              dropdownIconColor="#94a3b8"
            >
              <Picker.Item label="Select business type" value="" />
              {types.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Experience */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years of Experience *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5 years"
            value={formData.experience}
            onChangeText={(text) => handleChange('experience', text)}
          />
        </View>

        {/* Opening Hours */}
        <View style={styles.timeContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Opening Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 09:00"
              value={formData.openTime}
              onChangeText={(text) => handleChange('openTime', text)}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Closing Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 17:00"
              value={formData.closeTime}
              onChangeText={(text) => handleChange('closeTime', text)}
            />
          </View>
        </View>

        {/* Location Coordinates */}
        <View style={styles.timeContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Latitude *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 40.7128"
              value={formData.latitude}
              onChangeText={(text) => handleChange('latitude', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Longitude *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., -74.0060"
              value={formData.longitude}
              onChangeText={(text) => handleChange('longitude', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={[styles.button, isLoading && styles.disabledButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Registering...' : 'Register Business'}
              {!isLoading && (
                <Icon name="business-outline" size={20} color="#fff" style={styles.buttonIcon} />
              )}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  heading: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  businessImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  imageText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  pickerContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#0f172a',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default AddBusiness;