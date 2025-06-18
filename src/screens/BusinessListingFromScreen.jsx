import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Image, PermissionsAndroid, Platform,
  KeyboardAvoidingView, SafeAreaView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const BusinessForm = () => {
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
    longitude: '',
    latitude: ''
  });

  const [image, setImage] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  if (!Geolocation || typeof Geolocation.getCurrentPosition !== 'function') {
    Alert.alert('Error', 'Geolocation service not available.');
    setLocationLoading(false);
    return;
  }

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Location permission is required.');
        setLocationLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            longitude: longitude.toString(),
            latitude: latitude.toString()
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error(error);
          Alert.alert('Location error', error.message);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.error(err);
      setLocationLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') return true;

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.longitude || !formData.latitude) {
        await getCurrentLocation();
      }

      if (!image || Object.values(formData).some(val => !val.trim())) {
        Alert.alert('Error', 'All fields and image are required');
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      data.append('businessImage', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || `photo_${Date.now()}.jpg`
      });

      const res = await axios.post(
        `${API_BASE_URL}/api/business/add`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer <your_token>`
          }
        }
      );

      Alert.alert('Success', res.data.message);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>List Your Business</Text>

          {[
            'businessName', 'businessAddress', 'businessDescription',
            'phoneNumber', 'businessCategory', 'businessType',
            'experience', 'openTime', 'closeTime'
          ].map(field => (
            <TextInput
              key={field}
              placeholder={field}
              value={formData[field]}
              placeholderTextColor="gray"

              onChangeText={(text) => handleInputChange(field, text)}
              style={styles.input}
            />
          ))}

          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Choose Business Image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.preview}
            />
          )}

          <TouchableOpacity onPress={getCurrentLocation} style={styles.locationBtn}>
            <Text style={styles.submitText}>
              {locationLoading ? 'Fetching location...' : 'Get My Location'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BusinessForm;


const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  preview: {
    height: 150,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10
  },
  locationBtn: {
    backgroundColor: '#f0ad4e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  submitBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
