import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const trendingItems = [
  {
    title: 'Interior Designer',
    searches: '479 Searches',
    image: require('../assets/trending/interior.jpg'),
  },
  {
    title: 'Banquet Halls',
    searches: '799 Searches',
    image: require('../assets/trending/banquet.jpg'),
  },
  {
    title: 'Physiotherapists',
    searches: '393 Searches',
    image: require('../assets/trending/physio.jpg'),
  },
];

const TrendingCategoriesSection = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trending Categories near you</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {trendingItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}
            onPress={() => navigation.navigate('BusinessBySubcategory', {
              title: item.title,
            })}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.searches}</Text>
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
    backgroundColor: '#eee',
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});

export default TrendingCategoriesSection;
