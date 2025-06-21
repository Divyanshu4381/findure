import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { keyword = '', lat = 28.6139, lng = 77.2090 } = route.params || {}; // Default fallback

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/search`, {
        params: { keyword, lat, lng },
      });

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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.businessName}</Text>
      <Text style={styles.subtitle}>
        {item.businessCategory} | {item.businessType}
      </Text>
      <Text style={styles.description}>
        {item.businessDescription || 'No description available'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : results.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={styles.noResults}>
            No results found for "{keyword}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noResults: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#2D2D3F',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a0aec0',
    fontSize: 13,
    marginTop: 4,
  },
  description: {
    color: '#cbd5e0',
    fontSize: 13,
    marginTop: 6,
  },
});

export default SearchResultsScreen;
