import React, { useState, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet,
  Text, ScrollView, PermissionsAndroid, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Geolocation from '@react-native-community/geolocation';
// import Voice from '@react-native-voice/voice';

const HeaderSearchBar = () => {

  const navigation = useNavigation();
  const { user } = useUser();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isListening, setIsListening] = useState(false);

  // // === Voice recognition setup ===
  // useEffect(() => {
  //   Voice.onSpeechStart = () => setIsListening(true);
  //   Voice.onSpeechEnd = () => setIsListening(false);
  //   Voice.onSpeechResults = (event) => {
  //     const results = event.value || [];
  //     setQuery(results[0] || '');
  //   };

  //   return () => {
  //     Voice.destroy().then(() => Voice.removeAllListeners());
  //   };
  // }, []);

  // // === Mic Permission (Android) ===
  // const requestAudioPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //         {
  //           title: 'Microphone Permission',
  //           message: 'App needs access to your microphone for voice search.',
  //           buttonPositive: 'OK',
  //         }
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     } catch (err) {
  //       console.warn('Permission error:', err);
  //       return false;
  //     }
  //   }
  //   return true; // iOS doesn't require runtime mic permission
  // };

  // const startListening = async () => {
  //   const hasPermission = await requestAudioPermission();
  //   if (hasPermission) {
  //     try {
  //       await Voice.start('en-US');
  //     } catch (error) {
  //       console.error('Voice start error:', error);
  //     }
  //   }
  // };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (error) {
  //     console.error('Voice stop error:', error);
  //   }
  // };

  // const handleMicPress = () => {
  //   isListening ? stopListening() : startListening();
  // };

  // === Location Permission ===
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
        }
        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            setLocation({ latitude, longitude });
          },
          err => console.warn('Geo Error:', err.message),
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      } catch (e) {
        console.warn('Location Permission Error:', e);
      }
    };
    requestLocationPermission();
  }, []);

  // === Fetch Suggestions ===
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) return setSuggestions([]);
      if (!location.latitude || !location.longitude) return;

      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/users/search`, {
          params: {
            keyword: query,
            lat: location.latitude,
            lng: location.longitude,
          },
        });
        setSuggestions(res.data.data || []);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [query, location]);

  const handleSelect = (item) => {
    const searchText = item.businessCategory || item.businessName || item.businessType || '';
    setQuery(searchText);
    setSuggestions([]);
    handleSearch(searchText);
  };

  const handleSearch = (text) => {
    if (text.trim()) {
      navigation.navigate('SearchResultsScreen', { keyword: text, lat: location.latitude, lng: location.longitude });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoTextContainer}>
          <Text style={[styles.logoText, { color: '#10b981' }]}>Find</Text>
          <Text style={[styles.logoText, { color: '#fff' }]}>ure</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#A0AEC0" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for services, shops, etc."
          placeholderTextColor="#A0AEC0"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch(query)}
        />
        {/* <TouchableOpacity style={styles.iconButton} >
          <Icon name="mic-outline" size={20}  />
        </TouchableOpacity> */}
          {/* {color={isListening ? 'red' : 'black'} onPress={handleMicPress}} */}
        
      </View>

      {suggestions.length > 0 && (
        <ScrollView style={styles.suggestionBox}>
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
          {!loading && suggestions.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => handleSelect(item)}>
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>
                  {item.businessName || item.businessCategory || item.businessType}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E2F',
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1E1E2F',
    paddingVertical: 0,
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
  },
  suggestionBox: {
    backgroundColor: '#2D2D3F',
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    padding: 10,
    color: '#ccc',
  },
});

export default HeaderSearchBar;
