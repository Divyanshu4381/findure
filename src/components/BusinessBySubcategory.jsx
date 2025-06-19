import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../../config'; // Replace with your actual config path
import Linking from 'react-native';

const { width, height } = Dimensions.get('window');

const BusinessBySubcategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title = '' } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [repairServices, setRepairServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/search?lat=26.497511&lng=80.280968&keyword=${title}`);
        const result = await response.json();

        if (result.success) {
          setRepairServices(result.data);
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

  const renderServiceItem = ({ item }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={['#a7f3d0', '#10b981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
          ) : (
            <Icon name="business" size={width * 0.1} color="#fff" />
          )}
        </View>
        <View style={styles.leftContent}>
          <Text style={styles.name}>{item.businessName}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={width * 0.04} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
            <Text style={styles.ratingSubText}> ({item.ratingsCount || 50}) Ratings</Text>
          </View>
          <Text style={styles.location}>{item.address || 'Unknown Location'} - {item.distance || '3.0'} km</Text>
          <Text style={styles.status}>Open until {item.closingTime || '9:00 pm'}</Text>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}>
          <Icon name="call" size={width * 0.045} color="#fff" />
          <Text style={styles.callLabel}>Call</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.detailBox}>
        <Icon name="chatbox-ellipses-outline" size={width * 0.035} color="#6b7280" style={styles.detailIcon} />
        <Text style={styles.review}>{item.businessDescription || 'No description available'}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}>
          <Icon name="call" size={width * 0.04} color="#10b981" />
          <Text style={styles.actionText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Icon name="mail" size={width * 0.04} color="#10b981" />
          <Text style={styles.actionText}>Send Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`whatsapp://send?phone=${item.phoneNumber}`)}>
          <Icon name="logo-whatsapp" size={width * 0.04} color="#10b981" />
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.resultsText}>{title} - {repairServices.length} Results</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Sort by</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Icon name="star" size={width * 0.04} color="#fff" />
            <Text style={styles.filterText}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="flash" size={width * 0.04} color="#10b981" />
            <Text style={styles.filterText}>Quic</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={repairServices.filter((item) =>
            item.businessName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.025,
    fontSize: width * 0.04,
    color: '#1f2937',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
  },
  resultsText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#1f2937',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: width * 0.02,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeFilter: {
    backgroundColor: '#10b981',
  },
  filterText: {
    fontSize: width * 0.035,
    color: '#6b7280',
    marginLeft: width * 0.01,
  },
  list: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: height * 0.02,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: width * 0.03,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  leftContent: {
    flex: 1,
    paddingRight: width * 0.025,
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#fff',
    marginBottom: height * 0.005,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  ratingText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: width * 0.01,
  },
  ratingSubText: {
    fontSize: width * 0.03,
    color: '#d1fae5',
    marginLeft: width * 0.01,
  },
  location: {
    fontSize: width * 0.03,
    color: '#d1fae5',
    marginBottom: height * 0.002,
  },
  status: {
    fontSize: width * 0.03,
    color: '#d1fae5',
  },
  callBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callLabel: {
    color: '#fff',
    fontSize: width * 0.035,
    marginLeft: width * 0.015,
    fontWeight: '600',
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    padding: width * 0.03,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  detailIcon: {
    marginTop: height * 0.005,
    marginRight: width * 0.015,
  },
  review: {
    fontSize: width * 0.035,
    color: '#374151',
    flex: 1,
    lineHeight: height * 0.025,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.015,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
    backgroundColor: '#e0f2f7',
  },
  actionText: {
    fontSize: width * 0.035,
    color: '#10b981',
    marginLeft: width * 0.015,
    fontWeight: '500',
  },
  loader: {
    marginTop: height * 0.05,
  },
  errorText: {
    textAlign: 'center',
    marginTop: height * 0.05,
    color: '#ef4444',
    fontSize: width * 0.04,
  },
});

export default BusinessBySubcategory;