import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    latitude: '',
  });

  const [image, setImage] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
        return;
      }
      if (response.assets?.length > 0) {
        const selectedImage = response.assets[0];
        setImage({
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          fileName: selectedImage.fileName || `business_${Date.now()}.jpg`,
        });
      }
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Enable location permissions.');
      return;
    }

    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
        setLocationLoading(false);
      },
      (error) => {
        Alert.alert('Error', 'Could not get your location');
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000 }
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const requiredFields = [
        'businessName',
        'businessAddress',
        'businessDescription',
        'phoneNumber',
        'businessCategory',
        'businessType',
        'experience',
        'openTime',
        'closeTime',
        'longitude',
        'latitude',
      ];

      const missingFields = requiredFields.filter((f) => !formData[f].trim());
      if (missingFields.length > 0) {
        Alert.alert('Error', `Please fill: ${missingFields.join(', ')}`);
        setSubmitting(false);
        return;
      }

      if (!image) {
        Alert.alert('Error', 'Please select a business image');
        setSubmitting(false);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You need to login first');
        setSubmitting(false);
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append('businessImage', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });

      await axios.post(`${API_BASE_URL}/api/v1/users/listbusiness`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Business added successfully!');
      setSubmitting(false);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  const fieldConfig = [
    { key: 'businessName', label: 'Business Name', placeholder: 'Enter name' },
    { key: 'businessAddress', label: 'Address', placeholder: 'Enter address', multiline: true, numberOfLines: 3 },
    { key: 'businessDescription', label: 'Description', placeholder: 'Describe business', multiline: true, numberOfLines: 4 },
    { key: 'phoneNumber', label: 'Phone', placeholder: 'Contact number', keyboardType: 'phone-pad' },
    { key: 'businessCategory', label: 'Category', placeholder: 'e.g. Restaurant' },
    { key: 'businessType', label: 'Type', placeholder: 'e.g. Takeaway' },
    { key: 'experience', label: 'Experience', placeholder: 'e.g. 5 years' },
    { key: 'openTime', label: 'Opening Time', placeholder: 'e.g. 9:00 AM' },
    { key: 'closeTime', label: 'Closing Time', placeholder: 'e.g. 8:00 PM' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Business Registration</Text>
          {fieldConfig.map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.input, field.multiline && styles.multilineInput]}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChangeText={(text) => handleInputChange(field.key, text)}
                multiline={field.multiline}
                numberOfLines={field.numberOfLines || 1}
                keyboardType={field.keyboardType || 'default'}
              />
            </View>
          ))}

          {/* Coordinates */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location Coordinates</Text>
            <View style={styles.coordinateContainer}>
              <View style={styles.coordinateInput}>
                <Text style={styles.coordinateLabel}>Latitude</Text>
                <TextInput
                  style={[styles.input, formData.latitude && styles.disabledInput]}
                  placeholder="Auto-filled"
                  value={formData.latitude}
                  editable={!formData.latitude}
                />
              </View>
              <View style={styles.coordinateInput}>
                <Text style={styles.coordinateLabel}>Longitude</Text>
                <TextInput
                  style={[styles.input, formData.longitude && styles.disabledInput]}
                  placeholder="Auto-filled"
                  value={formData.longitude}
                  editable={!formData.longitude}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={locationLoading}>
              {locationLoading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Icon name="location" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Get Location</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Image</Text>
            <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
              <Icon name="image" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{image ? 'Change Image' : 'Select Image'}</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Business</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, color: '#333' },
  multilineInput: { minHeight: 100, textAlignVertical: 'top' },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#888' },
  coordinateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  coordinateInput: { width: '48%' },
  coordinateLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
  locationButton: { backgroundColor: '#4a90e2', borderRadius: 8, padding: 12, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  imageButton: { backgroundColor: '#6c757d', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitButton: { backgroundColor: '#28a745', borderRadius: 8, padding: 15, marginTop: 20, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '500', marginLeft: 8 },
  buttonIcon: { marginRight: 8 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
});

export default BusinessForm;