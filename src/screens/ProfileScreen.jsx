import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSignInButton from '../components/ui/CustomSignInButton';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi Guest!</Text>
          <Text style={styles.subText}>Sign in to unlock the full experience</Text>
          <CustomSignInButton onPress={() => navigation.navigate('Login')} />
        </View>

        {/* Business Section */}
        <TouchableOpacity style={styles.businessCard}>
          <Text style={styles.businessText}>List your Business for <Text style={styles.freeText}>Free</Text></Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.adCard}>
          <Icon name="newspaper-outline" size={18} />
          <Text style={styles.adText}>Advertise & Grow your Business</Text>
          <Icon name="chevron-forward" size={18} />
        </TouchableOpacity>

        {/* Language Section */}
        <Text style={styles.sectionTitle}>App and User Setting</Text>
        <View style={styles.languageRow}>
          {['English', 'हिंदी', 'தமிழ்', 'ಕನ್ನಡ'].map((lang, idx) => (
            <TouchableOpacity key={idx} style={[styles.langBtn, idx === 0 && styles.langBtnActive]}>
              <Text style={[styles.langText, idx === 0 && styles.langTextActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Options */}
        {[
          { label: 'Settings', icon: 'settings-outline' },
          { label: 'App Feedback', icon: 'chatbox-ellipses-outline' },
          { label: 'Share App', icon: 'share-social-outline' },
          { label: 'Customer Support', icon: 'headset-outline' },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.optionRow}>
            <Icon name={item.icon} size={20} color="#000" />
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Icon name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>More Information</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 8,
  },
  header: { paddingVertical: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  subText: { color: '#555', marginTop: 4 },
  businessCard: {
    backgroundColor: '#f3f4f6',
    marginVertical: 16,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  businessText: { fontWeight: '500' },
  freeText: { color: 'red' },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },
  adText: { flex: 1, fontWeight: '500' },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  langBtnActive: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  langText: {
    fontSize: 14,
    color: '#333',
  },
  langTextActive: {
    color: '#007bff',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  }
});

export default ProfileScreen;