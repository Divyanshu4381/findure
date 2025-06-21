// src/screens/ManageBusinessScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  Alert, Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageBusinessScreen = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigation = useNavigation();

  const fetchMyBusinesses = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/mybusiness`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const businessData = response.data.data || [];
      setBusinesses(businessData);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load businesses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (businessId) => {
    if (!businessId) {
      Alert.alert('Error', 'Invalid business ID.');
      return;
    }
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(businessId);
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) {
                Alert.alert('No access token found. Please log in.');
              }
              await axios.delete(`${API_BASE_URL}/api/v1/users/delete/${businessId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setBusinesses(businesses.filter((item) => (item.id || item._id) !== businessId));
              Alert.alert('Success', 'Business deleted successfully.');
            } catch (error) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete business. Please try again.'
              );
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (business) => {
    navigation.navigate('EditBusiness', { business });
  };

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  const renderItem = ({ item }) => {
    const businessId = item._id || item.id;

    return (
      <>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.businessName}</Text>
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.actionButton}
                // onPress={() => handleEdit(item)}
                disabled={deleting === businessId}
              >
                <Icon name="pencil" size={18} color="#10b981" />
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => handleDelete(businessId)}
                disabled={deleting === businessId}
              >
                {deleting === businessId ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Icon name="trash" size={18} color="#ef4444" />
                )}
              </Pressable>
            </View>
          </View>
          <Text style={styles.sub}>{item.businessCategory} | {item.businessType}</Text>
          <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
            {item.businessDescription || 'No description available'}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>Last updated: {new Date(item.updatedAt).toDateString()}</Text>
            <Text style={styles.footerText}>
              Created at: {new Date(item.createdAt).toDateString()}
            </Text>
          </View>
        </View>

      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Businesses</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
      ) : businesses.length === 0 ? (
        <View style={styles.noBusinessContainer}>
          <Text style={styles.noBusiness}>You haven’t listed any businesses yet.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddBusiness')}
          >
            <Text style={styles.addButtonText}>Add Your First Business</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={businesses}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id || item._id || `business-${index}`)}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  sub: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  noBusinessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noBusiness: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
export default ManageBusinessScreen;