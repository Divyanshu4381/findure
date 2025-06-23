// src/navigation/DrawerNavigator.js
import React from 'react';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import { useUser } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const AuthProtect=({children})=>{
    if(!user){
      navigation.navigate('Login');
      return null;
    }
    return children;
  }
  return (
    <AuthProtect>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerPosition: 'left',
        }}
      >
        <Drawer.Screen name="Main" component={BottomTabNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />

      </Drawer.Navigator>
    </AuthProtect>
  );
};

export default DrawerNavigator;
