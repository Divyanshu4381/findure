import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const products = [
  {
    title: 'Brick',
    vendors: '38.5k Vendors',
    image: require('../assets/b2b/brick.jpg'),
  },
  {
    title: 'Auto Rickshaw',
    vendors: '6.6k Vendors',
    image: require('../assets/b2b/rickshaw.jpg'),
  },
  {
    title: 'Roofing Sheets',
    vendors: '14.5k Vendors',
    image: require('../assets/b2b/roof.jpg'),
  },
];

const B2BProductSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular B2B Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {products.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.vendors}</Text>
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
    backgroundColor: '#f3f3f3',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: 'gray',
  },
});

export default B2BProductSection;
