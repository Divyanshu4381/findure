import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Image, Dimensions, Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../../config';

const { width, height } = Dimensions.get('window');

const BusinessBySubcategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title = '' } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/users/search?lat=26.497511&lng=80.280968&keyword=${title}`
        );
        const result = await response.json();

        if (result.success) {
          setBusinessList(result.data || []);
        } else {
          setError(result.message || 'No businesses found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [title]);

  const renderBusinessCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BusinessDetails', { business: item })}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {item.businessImage ? (
              <Image
                source={{
                  uri: item.businessImage.startsWith('http') ? item.businessImage : `${API_BASE_URL}${item.businessImage}`,
                }}
                style={styles.serviceImage}
              />
            ) : (
              <Icon name="business" size={width * 0.1} color="#6b7280" />
            )}
          </View>

          <View style={styles.leftContent}>
            <Text style={styles.name}>{item.businessName || 'Unnamed'}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={width * 0.04} color="#f59e0b" />
              <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
              <Text style={styles.ratingSubText}> ({item.ratingsCount || 50} Ratings)</Text>
            </View>
            <Text style={styles.location}>
              {item.businessAddress || 'No Address'} - {item.distance || '0'} km
            </Text>
            <Text style={styles.status}>Open until {item.closeTime || '9:00 pm'}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.review}>{item.businessDescription || 'No description provided'}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}>
            <Icon name="call" size={width * 0.04} color="#3b82f6" />
            <Text style={styles.actionText}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="mail" size={width * 0.04} color="#3b82f6" />
            <Text style={styles.actionText}>Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`whatsapp://send?phone=${item.phoneNumber}`)}>
            <Icon name="logo-whatsapp" size={width * 0.04} color="#3b82f6" />
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={width * 0.06} color="#3b82f6" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${title}...`}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity>
          <Icon name="mic" size={width * 0.055} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.resultsText}>{title} - {businessList.length} Results</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={businessList.filter((item) =>
            item.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderBusinessCard}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' // Light neutral background
  },
  searchBar: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    margin: width * 0.04, 
    paddingHorizontal: width * 0.03,
    borderRadius: 12, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1, 
    paddingVertical: 12, 
    paddingHorizontal: 12,
    fontSize: 16, 
    color: '#1f2937',
    fontWeight: '400',
  },
  filterRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
  },
  resultsText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  list: { 
    paddingHorizontal: width * 0.04, 
    paddingBottom: height * 0.02 
  },
  card: {
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 16,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 16, 
    backgroundColor: '#fff', // White header instead of green gradient
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  imageContainer: {
    width: 80, 
    height: 80, 
    borderRadius: 8,
    overflow: 'hidden', 
    marginRight: 12,
    backgroundColor: '#f1f5f9', // Subtle background for placeholder
  },
  serviceImage: { 
    width: '100%', 
    height: '100%' 
  },
  leftContent: { 
    flex: 1 
  },
  name: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937', 
    marginBottom: 6 
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  ratingText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1f2937', 
    marginLeft: 4 
  },
  ratingSubText: { 
    fontSize: 12, 
    color: '#6b7280', 
    marginLeft: 4 
  },
  location: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginBottom: 4 
  },
  status: { 
    fontSize: 12, 
    color: '#10b981', 
    fontWeight: '500' 
  },
  detailBox: {
    padding: 16,
    backgroundColor: '#fff',
  },
  review: { 
    fontSize: 14, 
    color: '#4b5563', 
    lineHeight: 20 
  },
  actionRow: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 16,
    borderRadius: 8, 
    backgroundColor: '#f1f5f9', // Subtle blue-gray for buttons
  },
  actionText: { 
    fontSize: 14, 
    color: '#3b82f6', 
    marginLeft: 6, 
    fontWeight: '600' 
  },
  loader: { 
    marginTop: 40 
  },
  errorText: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#ef4444', 
    fontSize: 16 
  },
});

export default BusinessBySubcategory;