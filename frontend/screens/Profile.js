import React from 'react';
import { View, Button, } from 'react-native';
import { AsyncStorage } from 'react-native';

import tabBarIcon from '../components/tabBarIcon';

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarTestID: 'profile_tab',
        tabBarIcon: tabBarIcon('md-person'),
    };

    async handleLogOut(){
        await AsyncStorage.setItem('loggedIn', "false");
        await AsyncStorage.removeItem('userId');
        this.props.navigation.navigate('Welcome');
    }

    render() {
        return (
            <View testID="profile_screen">
                <Button testID="logout_button" title="Logout" onPress={() => this.handleLogOut()}/>
            </View>
        );
    }
}