import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Make sure you have this installed

const BellButton = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  const ringBell = () => {
    rotation.setValue(0);
    Animated.sequence([
      Animated.timing(rotation, { toValue: 1, duration: 100, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(rotation, { toValue: -1, duration: 100, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(rotation, { toValue: 0.5, duration: 100, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(rotation, { toValue: 0, duration: 100, useNativeDriver: true, easing: Easing.linear }),
    ]).start();
  };

  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <TouchableOpacity onPress={ringBell} activeOpacity={0.7}>
      <Animated.View style={[styles.button, { transform: [{ rotate }] }]}>
        <Icon name="bell" size={18} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#00000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 10,
  },
});

export default BellButton;
