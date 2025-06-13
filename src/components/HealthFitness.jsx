import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.28; // ~28%  screen width ke liye 
const IMAGE_SIZE = CARD_WIDTH;

const healthData = [
  {
    title: 'Gym',
    image: require('../assets/HealthFitness/gym.jpg'),
  },
  {
    title: 'Yoga',
    image: require('../assets/HealthFitness/yoga.jpg'),
  },
  {
    title: 'Sports',
    image: require('../assets/HealthFitness/sports.jpg'),
  },
  {
    title: 'Meditation',
    image: require('../assets/HealthFitness/meditation.jpg'),
  },
];

const HealthFitness = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health & Fitness</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {healthData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HealthFitness;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: width * 0.055, // ~20 on most screens
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#10b981',
  },
  card: {
    marginRight: 14,
    alignItems: 'center',
    width: CARD_WIDTH,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 14,
  },
  label: {
    marginTop: 8,
    fontSize: width * 0.035, // ~13-14
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
