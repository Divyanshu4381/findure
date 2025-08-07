// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NoInternetScreen from './src/screens/NoInternetScreen';
import NetInfo from '@react-native-community/netinfo';

import Orientation from 'react-native-orientation-locker';
import { AuthProvider } from './src/context/AuthContext';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { StatusBar } from 'react-native'


const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    Orientation.lockToPortrait(); // Lock to portrait when screen mounts
    const checkConnection = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      checkConnection(); // Clean up listener on unmount
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#10b981" translucent={false} />
      <NavigationContainer>
        {isConnected ? <BottomTabNavigator /> : <NoInternetScreen />}
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
