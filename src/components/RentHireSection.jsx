import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const rentItems = [
  {
    title: 'Car Rental',
    image: require('../assets/rent/car.jpg'),
  },
  {
    title: 'Clothes on Rent',
    image: require('../assets/rent/clothes.jpg'),
  },
  {
    title: 'Furniture on Rent',
    image: require('../assets/rent/furniture.jpg'),
  },
  {
    title: 'Appliances on Rent',
    image: require('../assets/rent/appliance.jpg'),
  },
];

const RentHireSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rent & Hire</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {rentItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    marginTop: 12,
  },
  card: {
    width: 130,
    marginRight: 16,
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RentHireSection;
