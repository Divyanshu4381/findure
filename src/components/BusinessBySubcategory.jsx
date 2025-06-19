import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Image, Dimensions, Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
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
      <View style={styles.card}>
        <LinearGradient colors={['#a7f3d0', '#10b981']} style={styles.header}>
          <View style={styles.imageContainer}>
            {item.businessImage ? (
              <Image
                source={{
                  uri: item.businessImage.startsWith('http') ? item.businessImage : `${API_BASE_URL}${item.businessImage}`,
                }}
                style={styles.serviceImage}
              />
            ) : (
              <Icon name="business" size={width * 0.1} color="#fff" />
            )}
          </View>

          <View style={styles.leftContent}>
            <Text style={styles.name}>{item.businessName || 'Unnamed'}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={width * 0.04} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
              <Text style={styles.ratingSubText}> ({item.ratingsCount || 50} Ratings)</Text>
            </View>
            <Text style={styles.location}>
              {item.businessAddress || 'No Address'} - {item.distance || '0'} km
            </Text>
            <Text style={styles.status}>Open until {item.closeTime || '9:00 pm'}</Text>
          </View>

          
        </LinearGradient>

        <View style={styles.detailBox}>
          <Text style={styles.review}>{item.businessDescription || 'No description provided'}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}>
            <Icon name="call" size={width * 0.04} color="#10b981" />
            <Text style={styles.actionText}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="mail" size={width * 0.04} color="#10b981" />
            <Text style={styles.actionText}>Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`whatsapp://send?phone=${item.phoneNumber}`)}>
            <Icon name="logo-whatsapp" size={width * 0.04} color="#10b981" />
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={width * 0.06} color="#10b981" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${title}...`}
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity>
          <Icon name="mic" size={width * 0.055} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.resultsText}>{title} - {businessList.length} Results</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
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
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: width * 0.04, paddingHorizontal: width * 0.03,
    borderRadius: 12, elevation: 4,
  },
  searchInput: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 12,
    fontSize: 16, color: '#1f2937',
  },
  filterRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
  },
  resultsText: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  list: { paddingHorizontal: width * 0.04, paddingBottom: height * 0.02 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 16,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  imageContainer: {
    width: 100, height: 90, borderRadius: 8,
    overflow: 'hidden', marginRight: 12,
  },
  serviceImage: { width: '100%', height: '100%' },
  leftContent: { flex: 1, paddingRight: 8 },
  name: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginLeft: 4 },
  ratingSubText: { fontSize: 12, color: '#d1fae5', marginLeft: 4 },
  location: { fontSize: 12, color: '#d1fae5', marginBottom: 2 },
  status: { fontSize: 12, color: '#d1fae5' },
  callBtn: {
    backgroundColor: '#047857', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, flexDirection: 'row', alignItems: 'center',
  },
  callLabel: { color: '#fff', fontSize: 14, marginLeft: 6, fontWeight: '600' },
  detailBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#f0fdf4', padding: 12,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
  },
  detailIcon: { marginTop: 2, marginRight: 8 },
  review: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 8, backgroundColor: '#e0f2f7',
  },
  actionText: { fontSize: 14, color: '#10b981', marginLeft: 6, fontWeight: '500' },
  loader: { marginTop: 40 },
  errorText: { textAlign: 'center', marginTop: 40, color: '#ef4444', fontSize: 16 },
});

export default BusinessBySubcategory;
