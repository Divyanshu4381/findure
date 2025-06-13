import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40) / 4; 

const categories = [
  { title: 'B2b', icon: require('../assets/icons/b2b.png') },
  { title: 'Doctors', icon: require('../assets/icons/doctor.png') },
  { title: 'Travel', icon: require('../assets/icons/travel.png') },
  { title: 'Car Hire', icon: require('../assets/icons/car.png') },
  { title: 'Beauty', icon: require('../assets/icons/beauty.png') },
  { title: 'Wedding Planning', icon: require('../assets/icons/wedding.webp') },
  { title: 'Gym', icon: require('../assets/icons/gym.png') },
  { title: 'Education', icon: require('../assets/icons/education.png') },
  { title: 'Repairs & Services', icon: require('../assets/icons/repair.png') },
  { title: 'Rent or Hire', icon: require('../assets/icons/rent.png') },
  { title: 'Jobs', icon: require('../assets/icons/jobs.png') },
  { title: 'Show More', icon: require('../assets/icons/more.png') },
];

const CategoryGrid = () => {
  return (
    <View style={styles.grid}>
      {categories.map((item) => (
        <TouchableOpacity key={item.title} style={styles.card}>
          <View style={styles.iconContainer}>
            <Image source={item.icon} style={styles.icon} />
          </View>
          <Text style={styles.label} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryGrid;
const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    color: '#000',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});
