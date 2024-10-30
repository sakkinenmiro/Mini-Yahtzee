import React from 'react';
import {View} from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home.js';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard.js';
import styles from './style/style.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'information'
                : 'information-outline';

            } else if (route.name === 'Scoreboard') {
              iconName = focused
               ? 'view-list'
               : 'view-list-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons
             name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'steelblue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Gameboard" component={Gameboard} />
        <Tab.Screen name="Scoreboard" component={Scoreboard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}