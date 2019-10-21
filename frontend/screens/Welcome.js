import React, {Component} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

class Welcome extends Component {
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
