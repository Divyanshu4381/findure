import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const sundayItems = [
  { title: 'Refrigerator Dealers', image: require('../assets/sunday_essentials/freeze.jpg') },
  { title: 'Water Cooler Dealers', image: require('../assets/sunday_essentials/coolers.jpg') },
  { title: 'Ice Cream Parlour', image: require('../assets/sunday_essentials/icecream.jpg') },
  { title: 'Deep Freezer Dealers', image: require('../assets/sunday_essentials/freeze.jpg') },
  { title: 'Soft Drink Retailers', image: require('../assets/sunday_essentials/drinks.jpg') },
  { title: 'Waterproofing', image: require('../assets/sunday_essentials/proofing.jpg') },
  { title: 'AC AMC', image: require('../assets/sunday_essentials/ac_mc.jpg') },
  { title: 'Cooler Repair', image: require('../assets/sunday_essentials/cooler.jpg') },
  { title: 'Pest Control', image: require('../assets/sunday_essentials/pest.jpg') },
];

const Sunday_Essentials = () => {
  return (
    <ImageBackground
      source={require('../assets/sunday_essentials/B.jpg')}
      style={styles.backgroundContainer}
      resizeMode="cover"
      imageStyle={{ borderRadius: 12 }}
    >
      <Text style={styles.heading}>Sunday Essentials</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sundayItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.cardImage} />
            </View>
            <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default Sunday_Essentials;

const styles = StyleSheet.create({
  backgroundContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  card: {
    width: 120,
    height: 170,
    backgroundColor: 'rgba(255,255,255,0.1)', // glassmorphic effect
    marginRight: 14,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
