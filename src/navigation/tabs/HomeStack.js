import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import HomeService from '../../components/HomeService';
import BusinessBySubcategory from '../../components/BusinessBySubcategory';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeService" component={HomeService} />
      <Stack.Screen name="BusinessBySubcategory" component={BusinessBySubcategory} />

      
    </Stack.Navigator>
  );
};

export default HomeStack;
