import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Chat from '../screens/Chat';
import HomeScreenMap from '../screens/HomeScreenMap';
import Listings from '../screens/Listings';
import Profile from '../screens/Profile';
import StyleSheet from 'react-native';

const simpleStyledConfig = {
    shifting: false,
    activeColor: 'black',
    inactiveColor: 'white',
    barStyle: {
        backgroundColor: 'grey',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderColor: 'black',
    }
};

export default createMaterialBottomTabNavigator(
    {
        HomeScreenMap,
        Listings,
        Profile,
        Chat,
    },
    simpleStyledConfig
);