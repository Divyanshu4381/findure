import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const events = [
  {
    title: 'Caterers',
    image: require('../assets/Events/caterers.jpg'),
  },
  {
    title: 'Event Organizers',
    image: require('../assets/Events/event_organizers.jpg'),
  },
];

const cities = [
  { name: 'MUMBAI', image: require('../assets/City/mumbai.jpg') },
  { name: 'BANGALORE', image: require('../assets/City/bangalore.jpg') },
  { name: 'DELHI', image: require('../assets/City/delhi.jpg') },
  { name: 'KOLKATA', image: require('../assets/City/kolkata.jpg') },
];

const EventAndCitySection = () => {
  return (
    <View style={styles.container}>
      {/* Events */}
      <Text style={styles.heading}>Events</Text>
      <View style={styles.eventRow}>
        {events.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.eventCard,
              index === 0 ? { marginRight: 5 } : { marginLeft: 5 }, // gap between cards
            ]}
          >
            <Image source={item.image} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* Top Cities */}
      <Text style={styles.heading}>Explore Top Cities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cities.map((city, index) => (
          <TouchableOpacity key={index} style={styles.cityCard}>
            <Image source={city.image} style={styles.cityImage} />
            <View style={styles.overlay}>
              <Text style={styles.cityText}>{city.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventAndCitySection;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventCard: {
    width: (width - 48) / 2,
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  eventTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  cityCard: {
    width: 100,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  cityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
