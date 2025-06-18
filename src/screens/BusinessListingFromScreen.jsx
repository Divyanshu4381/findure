import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Image
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
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

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!image || Object.values(formData).some(val => !val.trim())) {
        Alert.alert('Error', 'All fields are required');
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
            Authorization: `Bearer <your_token>` // pass auth token here
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>List Your Business</Text>

      {[
        'businessName', 'businessAddress', 'businessDescription',
        'phoneNumber', 'businessCategory', 'businessType',
        'experience', 'openTime', 'closeTime', 'longitude', 'latitude'
      ].map(field => (
        <TextInput
          key={field}
          placeholder={field}
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          style={styles.input}
        />
      ))}

      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Pick Business Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.preview}
        />
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
    textAlign: 'center'
  },
  preview: {
    height: 150,
    width: '100%',
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
