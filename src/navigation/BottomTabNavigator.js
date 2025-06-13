import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeStack from './tabs/HomeStack'; // ✅ path check kar lena
import ProfileStack from './tabs/ProfileStack';
import NewsScreen from '../screens/NewsScreen';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#1E1E2F',
  active: '#10b981',
  inactive: '#A0A0B0',
  text: '#E2E8F0',
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.tabIconContainer}>
              <Icon
                name={iconName}
                size={width * 0.06}
                color={focused ? COLORS.active : COLORS.inactive}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  { color: focused ? COLORS.active : COLORS.inactive }
                ]}
              >
                {route.name}
              </Text>
            </View>
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />

      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS.background,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? height * 0.11 : height * 0.09,
    paddingBottom: Platform.OS === 'ios' ? height * 0.03 : height * 0.015,
    paddingTop: height * 0.01,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 5, // Fix for text overflow
  },
  tabLabel: {
    fontSize: width * 0.03,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default BottomTabNavigator;
