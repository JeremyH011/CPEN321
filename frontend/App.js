/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import HomeScreenMap from './screens/HomeScreenMap';
import Listings from './screens/Listings';
import Profile from './screens/Profile';
import Chat from './screens/Chat';

const AppTabNavigator = createMaterialBottomTabNavigator({
  HomeScreenMap: {screen: HomeScreenMap},
  Listings: {screen: Listings},
  Profile: {screen: Profile},
  Chat: {screen: Chat},
  });

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: {screen: Welcome},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
  TabNavigator: {screen: AppTabNavigator},
  });

const AppContainer = createAppContainer(AppTabNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  });
