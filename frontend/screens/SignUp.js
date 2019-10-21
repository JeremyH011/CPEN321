import React, { Component } from 'react'
import {View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator } from 'react-native';
  import { API_KEY, DB_URL } from '../key';
  import { Dropdown } from 'react-native-material-dropdown';
  import { onSignIn } from "../components/auth";

  export default class SignUp extends Component {
    constructor(props) {
      super(props);
      this.state = {
          scrollViewVisible: true,
          nameField: '',
          ageField: 0,
          jobField: '',
          emailField: '',
          passwordField: '',
          passwordConfirm: ''
        };
    }

    checkPasswords() {
      if(this.state.passwordField == this.state.passwordConfirm) {

      }

    }

    createAccountInDB = () => {
      return fetch(DB_URL+'signup/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          name: this.state.nameField,
          age: this.state.ageField,
          job: this.state.jobField,
          email: this.state.emailField,
          password: this.state.passwordField,
        }),
      })
      .then((response) => {
        if (response.status == 201) {
          onSignIn().then(() => this.props.navigation.navigate("SignedIn")).catch(() => alert("AsyncStorage error"));
        } else if (response.status == 401){
          alert("Invalid credentials");
        } else {
          alert("Server error. Try again later!");
        }
      });
    }

    render() {
      return (

        <ScrollView
          visible={this.state.scrollViewVisible}>
          <View style={styles.scrollView}>

              <Text>Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter your first and last name"
                editable={true}
                autoCapitalize={'words'}
                blurOnSubmit={false}
                returnKeyType={'next'}
                onChangeText={(name) => this.setState({nameField: name})}
                />
              <Text>Age</Text>
              <View style={styles.row}>
                <View style={styles.dropdown}>
                  <Dropdown
                    label='Age'
                    data={Age}
                    onChangeText={(age) => this.setState({ageField: parseInt(age)})}/>
                </View>
              </View>
              <Text>Job</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter your current occupation..."
                returnKeyType={'done'}
                blurOnSubmit={false}
                onChangeText={(job) => this.setState({jobField: job})}
                />
              <Text>Email</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Email address..."
                returnKeyType={'done'}
                autoCapitalize={'none'}
                blurOnSubmit={false}
                onChangeText={(email) => this.setState({emailField: email})}
                 />
              <Text>Password</Text>
              <TextInput secureTextEntry
                style={styles.modalTextInput}
                placeholder="Enter a password"
                returnKeyType={'done'}
                autoCapitalize={'none'}
                blurOnSubmit={false}
                onChangeText={(password) => this.setState({passwordField: password})}
                 />
              <Text>Confirm Password</Text>
              <TextInput secureTextEntry
                style={styles.modalTextInput}
                placeholder="Confirm Password..."
                returnKeyType={'done'}
                autoCapitalize={'none'}
                blurOnSubmit={false}
                onChangeText={(confirm) => this.setState({passwordConfirm: confirm})}
                onEndEditing={() => this.checkPasswords()} />

          <TouchableOpacity style={styles.modalButton} onPress={this.createAccountInDB}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => this.props.navigation.navigate("Login") }>
            <Text>I Already Have An Account</Text>
          </TouchableOpacity>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdown: {
      flex: 1,
    }
  });

  const Age = [
    {value: '18'},
    {value: '19'},
    {value: '20'},
    {value: '21'},
    {value: '22'},
    {value: '23'},
    {value: '24'},
    {value: '25'},
    {value: '26'},
    {value: '27'},
    {value: '28'},
    {value: '29'},
    {value: '30'},
    {value: '31'},
    {value: '32'},
    {value: '33'},
    {value: '34'},
    {value: '35'},
    {value: '36'},
    {value: '37'},
    {value: '38'},
    {value: '39'},
    {value: '40'},
    {value: '41'},
    {value: '42'},
    {value: '43'},
    {value: '44'},
    {value: '45'},
    {value: '46'},
    {value: '47'},
    {value: '48'},
    {value: '49'},
    {value: '50'},
    {value: '51'},
    {value: '52'},
    {value: '53'},
    {value: '54'},
    {value: '55'},
    {value: '56'},
    {value: '57'},
    {value: '58'},
    {value: '59'},
    {value: '60'},
    {value: '61'},
    {value: '62'},
    {value: '63'},
    {value: '64'},
    {value: '65'},
    {value: '66'},
    {value: '67'},
    {value: '68'},
    {value: '69'},
    {value: '70'},
    {value: '71'},
    {value: '72'},
    {value: '73'},
    {value: '74'},
    {value: '75'},
    {value: '76'},
    {value: '77'},
    {value: '78'},
    {value: '79'},
    {value: '80'},
    {value: '81'},
    {value: '82'},
    {value: '83'},
    {value: '84'},
    {value: '85'},
    {value: '86'},
    {value: '87'},
    {value: '88'},
    {value: '89'},
    {value: '90'},
    {value: '91'},
    {value: '92'},
    {value: '93'},
    {value: '94'},
    {value: '95'},
    {value: '96'},
    {value: '97'},
    {value: '98'},
    {value: '99'},
    {value: '100'},
    {value: '101'},
    {value: '102'},
    {value: '103'},
    {value: '104'},
    {value: '105'},
    {value: '106'},
    {value: '107'},
    {value: '108'},
    {value: '109'},
    {value: '110'},
  ];
