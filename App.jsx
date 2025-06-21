// App.js

import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import Orientation from 'react-native-orientation-locker';
import { AuthProvider } from './src/context/AuthContext';


const App = () => {
  
  useEffect(() => {
    Orientation.lockToPortrait(); // Lock to portrait when screen mounts

  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
