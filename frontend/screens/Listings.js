import React from 'react';
import { View, Text, Button} from 'react-native';

import tabBarIcon from '../components/tabBarIcon';

export default class Listings extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-list-box'),
    };

    render() {
        return (
            <View>
                <Text>Listings</Text>
            </View>
        );
    }
}
