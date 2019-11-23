import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView } from "react-native";
import { DB_URL } from '../key';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {

  state={
        email:'',
        password: ''
     }

  try_login = () => {
    return fetch(DB_URL+'login/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
        }),
    })
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else if (response.status == 401){
        alert("Invalid credentials");
      } else {
        alert("Server error. Try again later!");
      }
    })
    .then((responseJson) => {
      if (responseJson) {
        this.handleSuccessfulLogin(responseJson.userId);
        this.props.navigation.navigate('SignedIn');
      }
    });
  }

  async handleSuccessfulLogin(userId) {
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('loggedIn', "true");
  }

  render() {
    return (
          <ScrollView
            testID="login_screen"
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.title}>
              <Text style={styles.textTitle}>LOGIN</Text>
            </View>
            <View style={styles.container}>
              <TextInput
                testID="email_input"
                style={styles.textInput}
                placeholder="Email address..."
                returnKeyType={'done'}
                blurOnSubmit={false}
                autoCapitalize={'none'}
                onChangeText={(email) => this.setState({email})}
              />
              <TextInput secureTextEntry
                testID="password_input"
                style={styles.textInput}
                placeholder="Password"
                returnKeyType={'done'}
                blurOnSubmit={false}
                autoCapitalize={'none'}
                onChangeText={(password) => this.setState({password})}
              />
            </View>
            <View style={styles.buttoncontainer}>
              <Button color='#BA55D3' title="Login" style={styles.buttons} onPress={() => this.try_login()}/>
              <Button color='#8A2BE2' title="Go Back" style={styles.buttons} onPress={() => this.props.navigation.navigate('Welcome')}/>
            </View>
          </ScrollView>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex:7,
    alignItems:'center',
    justifyContent:'center'
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

  buttoncontainer: {
    flex:3,
    flexDirection: 'column',
    justifyContent:"center",
    padding: 10
  },

  buttons: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
  },

  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  }
})
