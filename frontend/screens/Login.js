import React from 'react'
import {View,
    StyleSheet,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator } from 'react-native';
import { API_KEY, DB_URL } from '../key';
import TextInputMask from 'react-native-text-input-mask';
import { onSignIn } from "../components/auth";

export default class Login extends React.Component {
    state = {
        scrollViewVisible: true,
        emailField: '',
        passwordField: '',
    }


    checkAccountInDB = () => {
        return fetch(DB_URL+'login/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.emailField,
                password: this.state.passwordField,
            }),
        })
        .then((response) => {
          if (response.status == 201) {
            onSignIn().then(() => this.props.navigation.navigate("SignedIn")).catch(() => alert("AsyncStorage error"));
          } else if (response.status == 401) {
            alert("Invalid credentials");
          } else {
            alert("Server error. Try again later!");
          }
        });
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.scrollView}>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Email address..."
                    returnKeyType={'done'}
                    blurOnSubmit={false}
                    autoCapitalize={'none'}
                    onChangeText={(email) => this.setState({emailField: email})}
                    />
                  <TextInput secureTextEntry
                    style={styles.modalTextInput}
                    placeholder="Password"
                    returnKeyType={'done'}
                    blurOnSubmit={false}
                    autoCapitalize={'none'}
                    onChangeText={(password) => this.setState({passwordField: password})}
                     />
                  <TouchableOpacity style={styles.modalButton} onPress={this.checkAccountInDB}>
                    <Text>Login</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modalTextInput: {
      height: 40,
      width: 300,
      borderWidth: 1,
      margin: 10,
      padding: 10,
    },
    modalButton: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
    },
    scrollView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});
