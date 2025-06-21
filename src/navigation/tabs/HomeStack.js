import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import BusinessBySubcategory from '../../components/BusinessBySubcategory';
import SearchResultsScreen from '../../screens/SearchResultsScreen';
import AddBusiness from '../../screens/BusinessListingFromScreen';
import LoginScreen from '../../screens/AuthScreen/LoginScreen';
import { useUser } from '../../context/AuthContext'; // Assuming you have a context for user authentication
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const { user } = useUser(); // Access the user context
  const AuthProtect= (Component) => {
    return (props) => {
      if (!user) {
        // If user is not authenticated, redirect to Login
        props.navigation.navigate('Login', { from: 'HomeStack' });
        return null; // Prevent rendering the component
      }
      return <Component {...props} />; // Render the component if authenticated
    };
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BusinessBySubcategory" component={BusinessBySubcategory} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
      
      <Stack.Screen
        name="AddBusiness"
        component={AuthProtect(AddBusiness)}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />

      
    </Stack.Navigator>
  );
};

export default HomeStack;
