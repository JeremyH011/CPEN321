import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AsyncStorage } from 'react-native';

class Welcome extends Component {

  componentDidMount () {
    this.checkIsLoggedIn();
  }

  async checkIsLoggedIn() {
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    if (loggedIn == "true") {
      this.props.navigation.navigate('TabNavigator');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.navigate('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  buttons: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
  },
})
