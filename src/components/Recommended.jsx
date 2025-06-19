import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6; // ~60%  screen width ke liye
const CARD_HEIGHT = 200;

const categories = [
    { name: 'AC Repair & Services Daikin', image: require('../assets/recommended/ac.jpg') },
    { name: 'Housekeeping Services', image: require('../assets/recommended/housekeeping.jpg') },
    { name: 'Residential Cleaning Services', image: require('../assets/recommended/cleaning.png') },
    { name: 'Tutorial for XI Computer Science', image: require('../assets/recommended/Computer.png') },
    { name: 'Tutorial for SBI Clerk', image: require('../assets/recommended/sbi.jpg') },
    { name: 'Salons Unisex', image: require('../assets/recommended/saloon.jpg') },
    { name: 'Diagnostic Centres - Digital HSG', image: require('../assets/recommended/diagnostic.jpg') },
    { name: 'Diagnostic Centres - Bone Marrow', image: require('../assets/recommended/bone.jpg') },
];

const RecommendedCategories = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Recommended Categories</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card}
                        onPress={() => navigation.navigate('BusinessBySubcategory', {
                            title: item.name,
                        })}
                    >
                        <Image source={item.image} style={styles.cardImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.cardText} numberOfLines={2}>
                                {item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default RecommendedCategories;

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
        color: '#10b981', // Teal green title
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        borderWidth: 1.2,
        borderColor: '#e2e8f0', // light gray-blue (good for soft look)
    },

    cardImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    cardText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
});
