import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const BusinessBySubcategory = () => {
  const navigation=useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for AC repair services
  const repairServices = [
    {
      id: '1',
      name: 'K G N Cooling Point',
      countryCode:'+91',
      number:'8957681217',
      rating: 5.0,
      ratingsCount: 8,
      image: 'https://via.placeholder.com/80', // Replace with actual image URL
      distance: '',
      yearsInBusiness: '',
      hours: '',
      review: '',
      respondsIn: '',
    },
    {
      id: '2',
      name: 'Rohit Aircool',
      rating: 3.7,
      ratingsCount: 66,
      image: 'https://via.placeholder.com/80', // Replace with actual image URL
      distance: 'Old Shivli Road Kalyanpur - 3.0 km',
      yearsInBusiness: '7 Years in Business',
      hours: 'Open until 9:00 pm',
      review: 'Rohit Aircool provides reliable home utility and repair services...',
      respondsIn: 'Responds in 5 mins',
    },
    {
      id: '3',
      name: 'Awego',
      rating: 4.8,
      ratingsCount: 45,
      image: 'https://via.placeholder.com/80', // Replace with actual image URL
      distance: 'Juhari Road Juhi... - 8.4 km',
      yearsInBusiness: '1 Year in Business',
      hours: 'Open until 11:30 pm',
      review: '"Satisfactory work" 15',
      trending: true,
    },
  ];

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <LinearGradient
        colors={['#e6fffa', '#a7f3d0']}
        style={styles.serviceHeader}
      >
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item.rating}</Text>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingsCount}> {item.ratingsCount} Ratings</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Icon name="call" size={20} color="#fff" />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.serviceDetails}>
        {item.distance && <Text style={styles.detailText}>{item.distance}</Text>}
        {item.yearsInBusiness && <Text style={styles.detailText}>{item.yearsInBusiness}</Text>}
        {item.hours && <Text style={styles.detailText}>{item.hours}</Text>}
        {item.review && <Text style={styles.reviewText}>{item.review}</Text>}
        {item.respondsIn && <Text style={styles.respondsText}>{item.respondsIn}</Text>}
        {item.trending && <Text style={styles.trendingText}>Trending</Text>}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="call" size={16} color="#007AFF" />
          <Text style={styles.actionButtonText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Send Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="logo-whatsapp" size={16} color="#25D366" />
          <Text style={styles.actionButtonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          
        <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search..."
          placeholderTextColor="#666"
        />
        <Icon name="mic" size={20} color="#007AFF" />
        <Icon name="refresh" size={20} color="#000" />
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text>Sort by</Text>
          <Icon name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text>Top Rated</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="flash" size={16} color="#000" />
          <Text>Quic</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultsText}>1.8k Results for your search</Text>
      <FlatList
        data={repairServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

export default BusinessBySubcategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    color: '#000',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  serviceItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  serviceInfo: {
    flexDirection: 'column',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  ratingsCount: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#FFC107',
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  serviceDetails: {
    padding: 10,
    backgroundColor: '#fff',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 5,
  },
  respondsText: {
    fontSize: 14,
    color: '#2ecc71',
    marginBottom: 5,
  },
  trendingText: {
    fontSize: 12,
    color: '#e67e22',
    backgroundColor: '#ffeaa7',
    padding: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionButtonText: {
    marginLeft: 5,
    color: '#007AFF',
    fontSize: 14,
  },
});