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
import TextInputMask from 'react-native-text-input-mask';
import CheckboxFormX from 'react-native-checkbox-form';

const data = [
  {
    label: 'Opt-in to Roommate Recommendation',
    RNchecked: false
  }
];

class SignUp extends Component {

  _onSelect = (item) => {
    this.setState({optIn: true});
  }

  state={
      nameField: '',
      ageField: 0,
      jobField: '',
      emailField: '',
      passwordField: "",
      passwordConfirm: "",
      optIn: false,
      passErrorMsg: ""
     }

  try_signup = () => {
    return fetch(DB_URL+'signup/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.nameField,
          age: this.state.ageField,
          job: this.state.jobField,
          email: this.state.emailField,
          password: this.state.passwordField,
          optIn: this.state.optIn,
        }),
    })
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else if (response.status == 401){
        alert("An account with that email already exists!");
      } else {
        alert("Server error. Try again later!");
      }
    })
    .then((responseJson) => {
      if (responseJson) {
        this.handleSuccessfulSignup(responseJson.userId);
        this.props.navigation.navigate('SignedIn');
      }
    });
  }

  checkPasswords(pass1, pass2) {
    if(!(pass1 === pass2)) {
      this.setState({passErrorMsg: "Passwords do not match."})
    } else {
      this.setState({passErrorMsg: ""});
      this.try_signup();
    }
  }

  async handleSuccessfulSignup(userId) {
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('loggedIn', "true");
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.title}>
          <Text style={styles.textTitle}>SIGN UP</Text>
        </View>
        <View style={styles.container}>
          <Text>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your first and last name"
            editable={true}
            autoCapitalize={'words'}
            blurOnSubmit={false}
            returnKeyType={'next'}
            onChangeText={(name) => this.setState({nameField: name})}
          />
          <Text>Age</Text>
          <TextInputMask
            keyboardType='numeric'
            style={styles.textInput}
            placeholder="Age"
            mask={"[99]"}
            onChangeText={(age) => this.setState({ageField: parseInt(age)})}/>
          <Text>Job</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your current occupation..."
            returnKeyType={'done'}
            blurOnSubmit={false}
            onChangeText={(job) => this.setState({jobField: job})}
          />
          <Text>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email address..."
            returnKeyType={'done'}
            autoCapitalize={'none'}
            blurOnSubmit={false}
            onChangeText={(email) => this.setState({emailField: email})}
          />
          <Text>Password</Text>
          <TextInput secureTextEntry
            style={styles.textInput}
            placeholder="Enter a password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            blurOnSubmit={false}
            onChangeText={(password) => this.setState({passwordField: password})}
          />
          <Text>Confirm Password</Text>
          <TextInput secureTextEntry
            style={styles.textInput}
            placeholder="Confirm Password..."
            returnKeyType={'done'}
            autoCapitalize={'none'}
            blurOnSubmit={false}
            onChangeText={(confirm) => this.setState({passwordConfirm: confirm})} />
          <Text style={{color: 'red'}}>{this.state.passErrorMsg}</Text>
        </View>
        <View style={styles.checkbox} >
          <CheckboxFormX
            style={{ width: 300}}
            dataSource={data}
            itemShowKey="label"
            itemCheckedKey="RNchecked"
            iconColor={"#BA55D3"}
            iconSize={32}
            formHorizontal={false}
            labelHorizontal={true}
            onChecked={(item) => this._onSelect(item)}
            />
        </View>
        <View style={styles.columncontainer}>
          <Button style={styles.buttons} color='#BA55D3' title="Sign Up!" onPress={() => this.checkPasswords(this.state.passwordField, this.state.passwordConfirm)} />
          <Button style={styles.buttons} color='#8A2BE2' title="Go Back" onPress={() => this.props.navigation.navigate('Welcome')}/>
        </View>
      </ScrollView>
    );
  }
}
export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex:4,
    alignItems:'center',
    justifyContent:'center',
  },

  columncontainer: {
    flex:2,
    flexDirection: 'column',
    justifyContent:"center"
  },

  checkbox: {
    flex:2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    marginHorizontal: 10
  },

  buttons: {
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

  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
})
