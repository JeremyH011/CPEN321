import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { onSignOut } from "../auth";

import tabBarIcon from '../components/tabBarIcon';

const styles = StyleSheet.create( {
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red'
  },
});

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    render() {
        return (
            <View>
                <Text style={styles.red}>Profile</Text>

                <TouchableOpacity onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut")).catch(() => alert("An error has occurred"))}>
                  <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
