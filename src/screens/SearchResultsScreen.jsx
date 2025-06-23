import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const SearchResultsScreen = () => {
  const route = useRoute();
  const { keyword, lat, lng } = route.params || {};
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/users/search?lat=${lat}&lng=${lng}&keyword=${keyword}`,
      );
      setResults(response.data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [keyword]);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat2 || !lng2) return 'N/A';
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Distance in km
  };

  const renderItem = ({ item }) => {
    console.log('Rendering item:', item);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('BusinessDetails', { business: item })}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{
              uri: item.businessImage || 'https://via.placeholder.com/150',
            }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Optional: you can add a default image here if needed */}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.businessName}</Text>
          <Text style={styles.subtitle}>
            {item.businessCategory} | {item.businessType}
            {item.lat && item.lng ? ` | ${getDistance(lat, lng, item.lat, item.lng)} km` : ''}
          </Text>
          {item.rating ? (
            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name={i < Math.floor(item.rating) ? 'star' : 'star-outline'}
                  size={14}
                  color="#FFD700"
                />
              ))}
              <Text style={styles.ratingText}>({item.rating})</Text>
            </View>
          ) : null}
          <Text style={styles.description} numberOfLines={2}>
            {item.businessDescription || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results for "{keyword}"</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
      ) : results.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search-outline" size={48} color="#6B7280" style={styles.noResultsIcon} />
          <Text style={styles.noResults}>No results found for "{keyword}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981', // Green header
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  loader: {
    marginTop: 40,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // White for no-results
  },
  noResultsIcon: {
    marginBottom: 16,
  },
  noResults: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB', // Light gray card
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#111827', // Dark gray
    fontSize: 16,
    fontWeight: '700',
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  subtitle: {
    color: '#6B7280', // Medium gray
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  rating: {
    flexDirection:

      'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  description: {
    color: '#4B5563', // Lighter gray
    fontSize: 13,
    marginTop: 4,
    fontWeight: '400',
    lineHeight: 18,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});

export default SearchResultsScreen;