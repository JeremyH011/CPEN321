import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Image } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

class Welcome extends Component {

  componentDidMount () {
    this.checkIsLoggedIn();
  }

  async checkIsLoggedIn() {
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    if (loggedIn == "true") {
      this.props.navigation.navigate('SignedIn');
    }
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image style={{height: 350, resizeMode : 'center', margin:5}} source={require('../components/Rent_Easy_logo.png')} />
          </View>
        </View>
        <View style={styles.column}>
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
  logo: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    flexDirection:'column',
    padding: 10
  }
})
