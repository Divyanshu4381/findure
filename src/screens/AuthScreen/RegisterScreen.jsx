import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const RegisterForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [headingAnim] = useState(new Animated.Value(0));
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headingAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Function to handle avatar selection (implement your image picker logic here)
  const handleAvatarPick = () => {
    // Add your image picker implementation here
    // For example, using react-native-image-picker
    console.log('Avatar picker opened');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back-circle-outline" size={24} color="#10b981" />
        </TouchableOpacity>

        <Animated.Text style={[styles.heading, { 
          opacity: headingAnim, 
          transform: [{ translateY: headingAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }) }]
        }]}>
          Create Account
        </Animated.Text>

        <View style={[styles.inputContainer, isFocusedUsername && styles.inputContainerFocused]}>
          <Icon name="person-outline" size={20} color={isFocusedUsername ? '#10b981' : '#94a3b8'} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setIsFocusedUsername(true)}
            onBlur={() => setIsFocusedUsername(false)}
          />
        </View>

        <View style={[styles.inputContainer, isFocusedEmail && styles.inputContainerFocused]}>
          <Icon name="mail-outline" size={20} color={isFocusedEmail ? '#10b981' : '#94a3b8'} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />
        </View>

        <View style={[styles.inputContainer, isFocusedPassword && styles.inputContainerFocused]}>
          <Icon name="lock-closed-outline" size={20} color={isFocusedPassword ? '#10b981' : '#94a3b8'} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
          />
        </View>

        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarPick}
          activeOpacity={0.7}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="camera-outline" size={24} color="#94a3b8" />
              <Text style={styles.avatarText}>Add Avatar</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>
              Register
              <Icon name="person-add-outline" size={20} color="#fff" style={styles.buttonIcon} />
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.orText}>Or Register with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
            <Icon name="logo-google" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000000' }]}>
            <Icon name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}>
            <Icon name="logo-twitter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.agreement}>
            <Icon name="document-text-outline" size={14} color="#38bdf8" /> User License Agreement
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  wrapper: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  heading: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3E',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 8,
  },
  inputContainerFocused: {
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  inputIcon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#E2E8F0',
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E2E3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  avatarText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  orText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 12,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  agreement: {
    fontSize: 13,
    color: '#38bdf8',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});