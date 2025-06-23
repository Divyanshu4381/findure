import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/no-internet.jpg')} // Optional image
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>Please check your connection and try again.</Text>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});
