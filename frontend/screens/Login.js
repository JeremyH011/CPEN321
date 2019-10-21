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
import { onSignIn } from "../auth";

export default class LoginPage extends React.Component {
    // @todo: change this so that fields related to listing are
    //        their own obj inside state, rather than remain as
    //        members of state. refer to userLocation inside
    //        HomeScreenMap.js
    state = {
        scrollViewVisible: true,
        emailField: '',
        passwordField: '',
    }

    handleEmailChange(email, handleTextChange) {
        handleTextChange(email);
        this.setState({emailField: email});
    }

    handlePasswordChange(password, handleTextChange) {
      handleTextChange(password);
      this.setState({passwordField: password});
    }


    checkAccountInDB = () => {
        fetch(DB_URL+'get_user_account/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.emailField,
                password: this.state.passwordField,
            }),
        });
        onSignIn().then(() => this.props.navigation.navigate("SignedIn")).catch(() => alert("failed to login"));
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.scrollView}>
                    <TextInputMask
                        style={styles.modalTextInput}
                        placeholder="Email"
                        mask={"[ex. renters@gmail.com]"}
                        onChangeText={(text) => this.handleEmailChange({text, handleTextChange})}/>

                    <TextInputMask
                        style={styles.priceTextInput}
                        placeholder="Password"
                        mask={"[Enter password here...]"}
                        onChangeText={(text) => this.handlePasswordChange(text, handleTextChange)}/>

                    <View style={styles.column}>
                        <TouchableOpacity style={styles.modalButton} onPress={this.checkAccountInDB}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => this.props.navigation.navigate("SignUp")}>
                            <Text>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
      height: 250,
      width: 300,
    },
    priceTextInput: {
        marginTop: 30,
        height: 40,
        borderWidth: 1,
        margin: 10,
        padding: 10,
    },
    column: {
        flexDirection: 'column',
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown: {
        flex: 1,
        margin: 10,
        padding: 10,
    }
});
