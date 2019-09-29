import React from 'react';
import { View, Text, } from 'react-native';

import tabBarIcon from '../components/tabBarIcon';

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    render() {
        return (
            <View>
                <Text>Profile</Text>
            </View>
        );
    }
}