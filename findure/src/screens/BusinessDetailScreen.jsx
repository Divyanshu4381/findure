import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BusinessDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { business } = route.params || {};
    const { width } = Dimensions.get('window');
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    if (!business._id) return <Text style={styles.loading}>Loading...</Text>;

    const handleCall = () => {
        if (business.phoneNumber) {
            Linking.openURL(`tel:${business.phoneNumber}`);
        } else {
            Alert.alert('Phone number not available');
        }
    };

    const handleMessage = () => {
        if (business.phoneNumber) {
            Linking.openURL(`sms:${business.phoneNumber}`);
        } else {
            Alert.alert('Phone number not available');
        }
    };

    const handleWhatsApp = () => {
        if (business.phoneNumber) {
            const phone = business.phoneNumber.replace(/^\+?91/, '91');
            Linking.openURL(`https://wa.me/${phone}`);
        } else {
            Alert.alert('Phone number not available');
        }
    };

    const handleOpenMap = () => {
    if (business.latitude && business.longitude) {
        const label = encodeURIComponent(business.businessName || 'Business Location');
        const url = `https://www.google.com/maps?q=loc:${business.latitude},${business.longitude}(${label})`;
        Linking.openURL(url);
    } else if (business.businessAddress) {
        const query = encodeURIComponent(`${business.businessName}, ${business.businessAddress}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    } else {
        Alert.alert('Address not available');
    }
};



    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} >
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>

                    {/* 🔙 Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>

                    {/* Banner */}
                    <Image
                        source={{ uri: business.businessImage }}
                        style={[styles.cardImage, { width: width - 32 }]}
                        resizeMode="cover"
                    />

                    {/* Content */}
                    <View style={styles.cardContent}>
                        <Text style={styles.title}>{business.businessName}</Text>
                        <Text style={styles.subtitle}>
                            {business.businessCategory} • {business.businessType}
                        </Text>

                        {[  // info rows
                            ['location-outline', 'Address', business.businessAddress, handleOpenMap],
                            ['call-outline', 'Phone', business.phoneNumber, null],
                            ['briefcase-outline', 'Experience', `${business.experience} years`, null],
                            ['time-outline', 'Timings', `${business.openTime} - ${business.closeTime}`, null],
                            ['document-text-outline', 'Description', business.businessDescription, null],
                        ].map(([icon, label, value, onPress], idx) => {
                            const RowContent = (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconLabel}>
                                        <Icon name={icon} size={18} color="#10B981" style={{ marginRight: 6 }} />
                                        <Text style={styles.infoLabel}>{label}:</Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            onPress && { color: '#2563EB', textDecorationLine: 'underline' },
                                        ]}
                                    >
                                        {value}
                                    </Text>
                                </View>
                            );

                            return onPress ? (
                                <TouchableOpacity key={idx} onPress={onPress} activeOpacity={0.7}>
                                    {RowContent}
                                </TouchableOpacity>
                            ) : (
                                <View key={idx}>{RowContent}</View>
                            );
                        })}

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#10B981' }]} onPress={handleCall}>
                                <Icon name="call" size={18} color="#fff" />
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]} onPress={handleMessage}>
                                <Icon name="chatbubble-ellipses" size={18} color="#fff" />
                                <Text style={styles.buttonText}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
                                <Icon name="logo-whatsapp" size={18} color="#fff" />
                                <Text style={styles.buttonText}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BusinessDetailScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollViewContent: {
        padding: 16,
        paddingBottom: 30,
    },
    loading: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#374151',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 4,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 50,
        elevation: 2,
    },
    cardImage: {
        height: 200,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    cardContent: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 16,
    },
    infoRow: {
        marginBottom: 12,
    },
    infoIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontWeight: '600',
        color: '#10B981',
        fontSize: 14,
    },
    infoValue: {
        color: '#374151',
        fontSize: 14,
        marginLeft: 24,
        marginTop: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
