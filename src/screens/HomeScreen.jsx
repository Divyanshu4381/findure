import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import HeaderSearchBar from '../components/HeaderSearchBar';
import CategoryGrid from '../components/CategoryGrid';
import BusinessListingScreen from '../components/BusinessListingScreen';
// import EducationSection from '../components/EducationSection';
import Sunday_Essentials from '../components/Sunday_Eessentials';
import HealthFitness from '../components/HealthFitness';
import EducationSection from '../components/EducationSection ';
import RecommendedCategories from '../components/Recommended';
import EventAndCitySection from '../components/EventAndCitySection';
import B2BProductSection from '../components/B2BProductSection';
import BeautyGroomingSection from '../components/BeautyGroomingSection';
import RentHireSection from '../components/RentHireSection';
import TrendingCategoriesSection from '../components/TrendingCategoriesSection';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderSearchBar />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <CategoryGrid />
          </View>

          <View style={styles.sectionContainer}>
            <BusinessListingScreen />
          </View>

          <View style={styles.sectionContainer}>
            <EducationSection />
          </View>

          <View style={styles.sectionContainer}>
            <Sunday_Essentials />
          </View>

          <View style={styles.sectionContainer}>
            <HealthFitness />
          </View>
          <View>
            <RecommendedCategories/>
          </View>
          <View>
            <EventAndCitySection/>
          </View>
          <View>
            <B2BProductSection/>
          </View>
          <View>
            <BeautyGroomingSection/>
          </View>
          <RentHireSection/>
          <TrendingCategoriesSection/>
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 10,
  },
 
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E2F',
    marginBottom: 12,
  },
});


export default HomeScreen;
