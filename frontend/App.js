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
import { Platform, StatusBar } from "react-native";
import {
  StackNavigator,
  SwitchNavigator
} from "react-navigation";
import  { createStackNavigator }  from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import HomeScreenMap from './screens/HomeScreenMap';
import Listings from './screens/Listings';
import Profile from './screens/Profile';
import Chat from './screens/Chat';
import AsyncStorage from '@react-native-community/async-storage';

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: AppTabNavigator
      },
      SignedOut: {
        screen: AppSwitchNavigator
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};

const AppTabNavigator = createMaterialBottomTabNavigator({
  Home: {screen: HomeScreenMap},
  Listings: {screen: Listings},
  Profile: {screen: Profile},
  Chat: {screen: Chat},
  });

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: {screen: Welcome},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
  });

export default class App extends React.Component {

  state={
    signedIn: false,
    checkedSignIn: false
  }

  componentDidMount () {
    this.checkIsLoggedIn();
    this.setState({checkedSignIn: true});
  }

  async checkIsLoggedIn() {
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    this.setState({signedIn: loggedIn});
  }

  render() {
    if (!this.state.checkedSignIn) {
      return null;
    }
    const Layout = createRootNavigator(this.state.loggedIn);
    const AppContainer = createAppContainer(Layout);
    return <AppContainer />
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
