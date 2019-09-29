import React from 'react';
import { View, Text, } from 'react-native';

import tabBarIcon from '../components/tabBarIcon';

export default class Chat extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-chatboxes'),
    };

    render() {
        return (
            <View>
                <Text>Chat</Text>
            </View>
        );
    }
}