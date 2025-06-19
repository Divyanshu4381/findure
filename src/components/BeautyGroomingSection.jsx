import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const beautyItems = [
  {
    title: 'PARLOUR',
    image: require('../assets/beauty/parlour.jpg'),
  },
  {
    title: 'SPA',
    image: require('../assets/beauty/spa.jpg'),
  },
  {
    title: 'BEAUTY CLINICS',
    image: require('../assets/beauty/clinic.jpg'),
  },
  {
    title: 'MAKEUP',
    image: require('../assets/beauty/makeup.jpg'),
  },
];

const BeautyGroomingSection = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Beauty and Grooming</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {beautyItems.map((item, index) => (
          <TouchableOpacity
            key={index} onPress={() => navigation.navigate('BusinessBySubcategory', {
                        title: item.title,
                      })}>
          <ImageBackground
            key={index}
            source={item.image}
            style={styles.card}
            imageStyle={styles.image}
          >
            <View style={styles.overlay}>
              <Text style={styles.cardText}>{item.title}</Text>
            </View>
          </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    marginTop: 10,
  },
  card: {
    width: 130,
    height: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default BeautyGroomingSection;
