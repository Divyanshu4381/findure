import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Animated, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/AuthContext';
import { saveTokens, clearTokens } from '../../utils/storage';

const SignInForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [headingAnim] = useState(new Animated.Value(0));
  const { user, setUser, isLoading: authLoading } = useUser();

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

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/login`, {
        email,
        password
      }, {
        timeout: 10000
      });

      if (!response.data?.data?.accessToken || !response.data?.data?.refreshToken) {
        throw new Error('Invalid response structure from server');
      }

      const { accessToken, refreshToken, user } = response.data.data;
      
      // Save tokens to storage
      await saveTokens({ accessToken, refreshToken });
      
      // Update user context
      setUser(user);

      // Navigate to home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
          await clearTokens();
        } else if (error.response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later.';
        }
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      )}

      <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Icon name="arrow-back-circle-outline" size={24} color="#10b981" />
        </TouchableOpacity>

        <Animated.Text style={[styles.heading, {
          opacity: headingAnim,
          transform: [{
            translateY: headingAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }]
        }]}>
          Welcome Back
        </Animated.Text>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            autoFocus={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
            onSubmitEditing={handleSignIn}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={isLoading}
        >
          <Text style={[styles.forgot, isLoading && styles.disabledText]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={[styles.button, isLoading && styles.disabledButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && (
                <Icon name="log-in-outline" size={20} color="#fff" style={styles.buttonIcon} />
              )}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
        >
          <Text style={[styles.register, isLoading && styles.disabledText]}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or Sign in with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
            disabled={isLoading}
            onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available soon')}
          >
            <Icon name="logo-google" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#000000' }]}
            disabled={isLoading}
            onPress={() => Alert.alert('Coming Soon', 'Apple sign-in will be available soon')}
          >
            <Icon name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
            disabled={isLoading}
            onPress={() => Alert.alert('Coming Soon', 'Twitter sign-in will be available soon')}
          >
            <Icon name="logo-twitter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL('#')}
          disabled={isLoading}
        >
          <Text style={[styles.agreement, isLoading && styles.disabledText]}>
            <Icon name="document-text-outline" size={14} color="#38bdf8" /> User License Agreement
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
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
  forgot: {
    fontSize: 14,
    color: '#38bdf8',
    textAlign: 'right',
    marginBottom: 20,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  register: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  registerLink: {
    color: '#38bdf8',
    textDecorationLine: 'underline',
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
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default SignInForm;