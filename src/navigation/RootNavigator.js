// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/AuthScreen/LoginScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Drawer wrapped inside stack */}
      <Stack.Screen name="App" component={DrawerNavigator} />

      {/* Auth or modal screens */}
      {/* <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      /> */}

      {/* <Stack.Screen name="HomeServices" component={HomeService} /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
