import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/ProfileScreen';
import LoginScreen from '../../screens/AuthScreen/LoginScreen';
import RegisterForm from '../../screens/AuthScreen/RegisterScreen';


const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false,
              }}
            />
      <Stack.Screen
              name="Register"
              component={RegisterForm}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false,
              }}
            />
      
    </Stack.Navigator>
  );
};

export default ProfileStack;
