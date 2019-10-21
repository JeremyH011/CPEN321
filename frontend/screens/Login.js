import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { DB_URL } from '../key';

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
        this.props.navigation.navigate('TabNavigator');
      } else if (response.status == 401){
        alert("Invalid credentials");
      } else {
        alert("Server error. Try again later!");
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="email"
          style={styles.textInput}
          onChangeText={(email) => this.setState({email})}/>
        <TextInput
          placeholder="password"
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}/>
        <View style={styles.rowcontainer}>
          <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.navigate('Welcome')}>
            <Text>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={() => this.try_login()}>
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  rowcontainer: {
    flexDirection: 'row'
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
