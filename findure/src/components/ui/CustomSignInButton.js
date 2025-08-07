// src/components/CustomSignInButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomSignInButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Get started</Text>
      <View style={styles.iconWrapper}>
        <Icon name="arrow-forward-outline" size={20} color="#7b52b9" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 52,
    borderRadius: 30,
    position: 'relative',
    shadowColor: '#714da6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 4,
    marginTop: 12,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  iconWrapper: {
    position: 'absolute',
    right: 8,
    backgroundColor: '#fff',
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7b52b9',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    elevation: 4,
  }
});

export default CustomSignInButton;
