import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView } from "react-native";
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.title}>
          <Text style={styles.textTitle}>WELCOME</Text>
        </View>
        <View style={styles.container}>
          <Button style={styles.buttons} color='#BA55D3' title="Login" onPress={() => this.props.navigation.navigate('Login')}/>
          <Button style={styles.buttons} color='#8A2BE2' title="Sign Up" onPress={() => this.props.navigation.navigate('SignUp')}/>
        </View>
      </ScrollView>
    );
  }
}
export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex:24,
    justifyContent:'center',
  },

  buttons: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
  },

  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A2BE2'
  },

  textTitle: {
    fontSize:15,
    color:'white'
  },
})
