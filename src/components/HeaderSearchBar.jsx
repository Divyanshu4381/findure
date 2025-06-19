import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BellButton from './ui/BellButton';
import { useNavigation } from '@react-navigation/native';

const HeaderSearchBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon
            name="person-circle-outline"
            size={28}
            color="#A0AEC0"
          />
        </TouchableOpacity>

        <View style={styles.logoTextContainer}>
          <Text style={[styles.logoText, { color: '#10b981' }]}>Find</Text>
          <Text style={[styles.logoText, { color: '#FFFFFF' }]}>ure</Text>
        </View>

        <BellButton />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#A0AEC0" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for services, shops, etc."
          placeholderTextColor="#A0AEC0"
          
        />
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="scan-outline" size={20} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="mic-outline" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
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
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
  },
});

export default HeaderSearchBar;
