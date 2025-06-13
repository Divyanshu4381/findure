import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import

const services = [
  { id: '1', name: 'Ac Repair', icon: '📺' },
  { id: '2', name: 'Carpenters', icon: '🔨' },
  { id: '3', name: 'Chimney Repair', icon: '🧪' },
  { id: '4', name: 'Electricians', icon: '🔌' },
  { id: '5', name: 'Geyser Repair', icon: '🚿' },
  { id: '6', name: 'Home Cleaning', icon: '🧼' },
  { id: '7', name: 'Makeup & Hair Styling', icon: '💄' },
  { id: '8', name: 'Microwave Repair', icon: '📻' },
  { id: '9', name: 'Painters', icon: '🎨' },
  { id: '10', name: 'Pest Control Services', icon: '🕷️' },
];

const HomeService = () => {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.left}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#777" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>

      <Text style={styles.header}>Home Services</Text>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 26,
    marginRight: 14,
  },
  name: {
    fontSize: 17,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default HomeService;
