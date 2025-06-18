import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSignInButton from '../components/ui/CustomSignInButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/AuthContext';
import { getTokens, clearTokens } from '../utils/storage';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          setIsLoading(false);
          return;
        }
        else{
          console.log('Access Token:', accessToken);
          navigation.navigate('Home');

        }



      } catch (error) {
        console.error('Detailed Error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });

        if (error.response?.status === 401) {
          // Token is invalid/expired
          getTokens()
          Alert.alert('Session Expired', 'Please login again');
        } else if (error.message.includes('network')) {
          Alert.alert('Network Error', 'Please check your internet connection');
        } else {
          Alert.alert('Profile Error', 'Could not load profile information');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      clearTokens();
      setUser(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

      Alert.alert('Success', 'You have been logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {user ? (
            <>
              <Text style={styles.greeting}>Hi {user.username || 'User'}!</Text>
              <Text style={styles.emailText}>{user.email}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                
                <Text style={styles.logoutText}>Logout</Text>
                <Icon name="log-out-outline" size={18} color="#dc3545" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.greeting}>Hi Guest!</Text>
              <Text style={styles.subText}>Sign in to unlock the full experience</Text>
              <CustomSignInButton
                onPress={() => navigation.navigate('Login')}
                style={styles.signInButton}
              />
            </>
          )}
        </View>

        {/* Business Features (only for logged in users) */}
        {user && (
          <>
            <TouchableOpacity
              style={styles.businessCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AddBusiness')}
            >
              <View style={styles.businessIcon}>
                <Icon name="business-outline" size={20} color="#10b981" />
              </View>
              <Text style={styles.businessText}>List your Business for <Text style={styles.freeText}>Free</Text></Text>
              <Icon name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adCard}
              activeOpacity={0.7}
            >
              <Icon name="megaphone-outline" size={18} color="#10b981" />
              <Text style={styles.adText}>Advertise & Grow your Business</Text>
              <Icon name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          </>
        )}

        {/* App Settings Section */}
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.languageContainer}>
          <Text style={styles.languageTitle}>Select Language</Text>
          <View style={styles.languageRow}>
            {['English', 'हिंदी', 'தமிழ்', 'ಕನ್ನಡ'].map((lang, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.langBtn, idx === 0 && styles.langBtnActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.langText, idx === 0 && styles.langTextActive]}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Options List */}
        {[
          { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
          { label: 'App Feedback', icon: 'chatbox-ellipses-outline', screen: 'Feedback' },
          { label: 'Share App', icon: 'share-social-outline', action: () => console.log('Share') },
          { label: 'Customer Support', icon: 'headset-outline', screen: 'Support' },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => item.screen ? navigation.navigate(item.screen) : item.action?.()}
          >
            <View style={styles.optionIcon}>
              <Icon name={item.icon} size={20} color="#10b981" />
            </View>
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Riveyra Infotech </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  header: {
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  signInButton: {
    marginTop: 10,
    width: '80%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
    backgroundColor: '#fff',
    marginTop: 15,
    gap: 8,
  },
  logoutText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 15,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  businessIcon: {
    marginRight: 12,
  },
  businessText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  freeText: {
    color: '#10b981',
    fontWeight: '700',
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  adText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
  },
  languageContainer: {
    marginBottom: 25,
  },
  languageTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  langBtnActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  langText: {
    fontSize: 14,
    color: '#555',
  },
  langTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  optionIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});

export default ProfileScreen;