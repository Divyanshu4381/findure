import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Animated, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../../../config'; // Make sure to configure your API base URL
import * as mime from 'react-native-mime-types'; // For getting file MIME type
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [headingAnim] = useState(new Animated.Value(0));

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

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

    const handleAvatarPick = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
                Alert.alert('Error', 'Failed to select image');
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setAvatar({
                    uri: selectedImage.uri,
                    name: selectedImage.fileName || `avatar-${Date.now()}`,
                    type: mime.lookup(selectedImage.uri) || 'image/jpeg',
                });
            }
        });
    };

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (!avatar) {
            Alert.alert('Error', 'Please select an avatar');
            return;
        }
        if (!isOtpVerified) {
            Alert.alert('Error', 'Please verify OTP first');
            return;
        }
        setIsLoading(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('username', username.toLowerCase());
            formData.append('email', email);
            formData.append('password', password);
            formData.append('avatar', {
                uri: avatar.uri,
                name: avatar.name,
                type: avatar.type,
            });

            const response = await axios.post(`${API_BASE_URL}/api/v1/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                Alert.alert('Success', 'Registration successful! Please login.');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed';
            if (error.response) {
                if (error.response.status === 409) {
                    errorMessage = 'User already exists. Please login.';
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSendOtp = async () => {

        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/otp/send`, { phone });
            if (response.data.success) {
                Alert.alert('Success', 'OTP Sent');
                setIsOtpSent(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/otp/verify`, { phone, otp });
            if (response.data.success) {
                Alert.alert('Success', 'OTP Verified');
                setIsOtpVerified(true);
            } else {
                Alert.alert('Error', 'Invalid OTP');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'OTP verification failed');
        }
    };


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
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
                    Create Account
                </Animated.Text>

                <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#94a3b8"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

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
                    />
                </View>

                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={handleAvatarPick}
                    activeOpacity={0.7}
                >
                    {avatar ? (
                        <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="camera-outline" size={24} color="#94a3b8" />
                            <Text style={styles.avatarText}>Add Avatar</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={[styles.button, isLoading && styles.disabledButton]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Registering...' : 'Register'}
                            {!isLoading && (
                                <Icon name="person-add-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            )}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.register}>
                        already have an account? <Text style={styles.registerLink}>Login</Text>
                    </Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Or Register with</Text>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                        <Icon name="logo-google" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000000' }]}>
                        <Icon name="logo-github" size={24} color="white" />
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
    disabledButton: {
        opacity: 0.7,
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
        borderRadius: 50,
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

export default RegisterForm;