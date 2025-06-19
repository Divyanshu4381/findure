import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import BusinessBySubcategory from '../../components/BusinessBySubcategory';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BusinessBySubcategory" component={BusinessBySubcategory} />

      
    </Stack.Navigator>
  );
};

export default HomeStack;
