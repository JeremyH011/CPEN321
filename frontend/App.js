/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer } from 'react-navigation'
import { View } from 'react-native';
import BottomTabNavigator from './navigators/BottomTabNavigator';

const App = createAppContainer(BottomTabNavigator);

export default () => (
  <View style = {{ flex: 1}}>
    <App />
  </View>
);
