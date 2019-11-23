import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  Image } from "react-native";
import { DB_URL } from '../key';
import AsyncStorage from '@react-native-community/async-storage';
import TextInputMask from 'react-native-text-input-mask';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import ImagePicker from 'react-native-image-picker';

const radio_props = [
  {label: 'Yes', value: true},
  {label: 'No', value: false}
];

class SignUp extends Component {

  state={
      nameField: '',
      ageField: 0,
      jobField: '',
      emailField: '',
      passwordField: "",
      passwordConfirm: "",
      optIn: false,
      passErrorMsg: "",
      photo: null
     }

  handleChoosePhoto() {
    const options= {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({photo:response});
      }
    })
  }

  createFormData(body) {
    let data = new FormData();

    data.append("photo", {
      name: this.state.photo.fileName,
      type: this.state.photo.type,
      uri:
        Platform.OS === "android" ? this.state.photo.uri : this.state.photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key])
    });
    return data;
  }

  ensureFormComplete() {
    if (this.state.nameField == "") {
      alert("Must include a name!");
      return false;
    } else {
      if (this.state.emailField == "") {
        alert("Must include an email!");
        return false;
      } else {
        if (this.state.passwordField == "" || this.state.passwordConfirm == "") {
          alert("Must enter matching password in both boxes!");
          return false;
        } else {
          if (this.state.photo == null) {
            alert("Must include a profile photo!");
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }

  handleSignUp() {
    if (this.ensureFormComplete()) {
      this.try_signup()
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
      })
      .catch((error) => {
        alert(error);
      });
    }
  }

  try_signup() {
    let body = {
      name: this.state.nameField,
      age: this.state.ageField,
      job: this.state.jobField,
      email: this.state.emailField,
      password: this.state.passwordField,
      optIn: this.state.optIn,
    };
    return fetch(DB_URL+'signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: this.createFormData(body),
    });
  }

  checkPasswords(pass1, pass2) {
    if(!(pass1 === pass2)) {
      this.setState({passErrorMsg: "Passwords do not match."})
    } else {
      this.setState({passErrorMsg: ""});
      this.handleSignUp();
    }
  }

  async handleSuccessfulSignup(userId) {
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('loggedIn', "true");
  }

  render() {
    const {photo} = this.state;
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
          <Text>Opt-in to Roommate Recommendation feature</Text>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            formHorizontal={true}
            labelHorizontal={false}
            buttonColor={'#8A2BE2'}
            selectedButtonColor={'#8A2BE2'}
            animation={true}
            onPress={(value) => {this.setState({optIn:value})}}
          />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {photo && (
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 150, height: 150 }}
            />
          )}
        </View>
        <View style={styles.columncontainer}>
        <Button style={styles.buttons} color='#A80097' title="Choose a Profile Photo" onPress={() => {this.handleChoosePhoto()}}/>
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
    justifyContent:"center",
    padding: 10
  },
  row: {
      flexDirection: 'row',
      width: 300,
      alignItems: 'center',
      justifyContent: 'center',
  },
  buttons: {
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
  },
  title: {
    flex: 2,
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
  column: {
    flex: 1,
    justifyContent : 'space-around',
    flexDirection:'column',
    padding: 10
  }
})
