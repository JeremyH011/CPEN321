import React from 'react';
import { View, Button, } from 'react-native';
import { AsyncStorage } from 'react-native';

import tabBarIcon from '../components/tabBarIcon';

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    async handleLogOut(){
        await AsyncStorage.setItem('loggedIn', "false");
        await AsyncStorage.removeItem('userId');
        this.props.navigation.navigate('Welcome');
    }

    render() {
        return (
            <View>
                <Button title="Logout" onPress={() => this.handleLogOut()}/>
            </View>
        );
    }
}