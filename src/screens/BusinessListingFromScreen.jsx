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
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BusinessForm = () => {
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
    longitude: '',
    latitude: '',
  });

  const [image, setImage] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selectedDate, field) => {
    if (Platform.OS === 'android') {
      setShowOpenTimePicker(false);
      setShowCloseTimePicker(false);
    }
    if (selectedDate) {
      const formattedTime = formatTime(selectedDate);
      setFormData((prev) => ({ ...prev, [field]: formattedTime }));
    }
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
    console.log("i am here")
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
      navigation.goBack();

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
    {
      key: 'openTime',
      label: 'Opening Time',
      placeholder: 'e.g. 09:00',
      onPress: () => setShowOpenTimePicker(true),
      value: formData.openTime,
      isTimePicker: true,
    },
    {
      key: 'closeTime',
      label: 'Closing Time',
      placeholder: 'e.g. 20:00',
      onPress: () => setShowCloseTimePicker(true),
      value: formData.closeTime,
      isTimePicker: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Business Registration</Text>
          {fieldConfig.map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              {field.isTimePicker ? (
                <TouchableOpacity
                  style={[styles.input, styles.timeInput]}
                  onPress={field.onPress}
                >
                  <Text style={field.value ? styles.timeText : styles.placeholderText}>
                    {field.value || field.placeholder}
                  </Text>
                  <Icon name="time-outline" size={18} color="#3b82f6" />
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={[styles.input, field.multiline && styles.multilineInput]}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  multiline={field.multiline}
                  numberOfLines={field.numberOfLines || 1}
                  keyboardType={field.keyboardType || 'default'}
                />
              )}
            </View>
          ))}

          {showOpenTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              onChange={(event, date) => handleTimeChange(event, date, 'openTime')}
            />
          )}
          {showCloseTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              onChange={(event, date) => handleTimeChange(event, date, 'closeTime')}
            />
          )}

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
              {locationLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
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
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Business</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#6b7280',
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#1f2937',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  coordinateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateInput: {
    width: '48%',
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  locationButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

export default BusinessForm;