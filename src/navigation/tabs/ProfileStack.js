import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/ProfileScreen';
import LoginScreen from '../../screens/AuthScreen/LoginScreen';
import RegisterForm from '../../screens/AuthScreen/RegisterScreen';
import BusinessRegistrationForm from '../../screens/BusinessListingFromScreen';
import AddBusiness from '../../screens/BusinessListingFromScreen';
import ManageBusinessScreen from '../../screens/ManageBusinessScreen';


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
        name="AddBusiness"
        component={AddBusiness}
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
        }} />
      <Stack.Screen name="ManageBusiness" component={ManageBusinessScreen} />


    </Stack.Navigator>
  );
};

export default ProfileStack;
