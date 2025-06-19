import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeServices = () => {
  const navigation = useNavigation();

  const serviceCategories = [
    { name: 'AC REPAIR', image: require('../assets/businessList/ac.jpeg') },
    { name: 'PEST CONTROL', image: require('../assets/businessList/pest.jpg') },
    { name: 'PACKERS & MOVE', image: require('../assets/businessList/packers.jpg') },
    { name: 'DEEP CLEANING', image: require('../assets/businessList/cleaning.jpg') },
    { name: 'PLUMBING', image: require('../assets/businessList/plumber.jpg') },
    { name: 'ELECTRICIAN', image: require('../assets/businessList/electrician.jpg') },
    { name: 'CARPENTER', image: require('../assets/businessList/carpenter.jpg') },
    { name: 'PAINTER', image: require('../assets/businessList/painter.jpg') },
  ];

  const shortcutServices = [
    { title: 'JioMart', subtitle: 'SHOPPING', image: require('../assets/businessList/jiomart.png') },
    { title: 'AJIO', subtitle: 'FASHION', image: require('../assets/businessList/ajio.png') },
    { title: 'Tira', subtitle: 'BEAUTY', image: require('../assets/businessList/tira.png') },
    { title: 'PAY', subtitle: 'BILLS', image: require('../assets/businessList/paybills.png') },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Text style={styles.heroTitle}>List your business</Text>
        <View style={styles.freeBadge}>
          <Text style={styles.freeText}>Free</Text>
        </View>
        <Text style={styles.heroSubtitle}>Reach thousands of customers in your area</Text>
        <TouchableOpacity style={styles.startNowButton}>
          <Text style={styles.startNowText}>Start Now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Title with Icon */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Home Services</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('BusinessBySubcategory', {
            title: 'Home Services',
          })}>
          <Image
            source={require('../assets/icons/arrowRightIcon.png')}
            style={styles.sectionIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      


      {/* Horizontal Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {serviceCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryCard} onPress={() => navigation.navigate('BusinessBySubcategory', {
            title: category.name,
          })}>
            <ImageBackground
              source={category.image}
              style={styles.categoryBackground}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.serviceGridContainer}>
        {shortcutServices.map((item, index) => (
          <TouchableOpacity key={index} style={styles.serviceCard}>
            <ImageBackground
              source={item.image}
              style={styles.serviceBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.serviceOverlay}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroContainer: {
    backgroundColor: '#10b981',
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  freeBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  freeText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 14,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  startNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startNowText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E2F',
  },
  sectionIcon: {
    width: 21,
    height: 21,
    tintColor: '#1E1E2F',
  },
  categoriesScroll: {
    marginTop: 10,
    paddingLeft: 15,
  },
  categoryCard: {
    width: 100,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  categoryBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  serviceGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  serviceCard: {
    width: '47%',
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  serviceBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  serviceOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#e5e5e5',
  },
});

export default HomeServices;
