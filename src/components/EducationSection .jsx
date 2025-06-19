import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';

const EducationSection = () => {
    const navigation = useNavigation();
    const educationItems = [
        { title: 'Schools', image: require('../assets/education/schools.jpg') },
        { title: 'Colleges', image: require('../assets/education/colleges.jpg') },
        { title: 'Coaching centers', image: require('../assets/education/coaching.jpg') },
    ];

    return (
        <View style={styles.container}>
            {/* Title Row */}
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Education</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('BusinessBySubcategory', {
                        title: 'Education',
                    })}>
                    <Image
                        source={require('../assets/icons/arrowRightIcon.png')}
                        style={styles.sectionIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Horizontal Scroll Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {educationItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate('BusinessBySubcategory', {
            title: item.title,
          })}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E1E2F',
    },
    sectionIcon: {
        width: 21,
        height: 21,
        tintColor: '#1E1E2F',
    },
    card: {
        marginRight: 15,
        alignItems: 'center',
        width: 100,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginBottom: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1E1E2F',
        textAlign: 'center',
    },
});

export default EducationSection;
