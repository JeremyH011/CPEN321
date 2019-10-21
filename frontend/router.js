import React from "react";
import { Platform, StatusBar } from "react-native";
import {
  StackNavigator,
  SwitchNavigator
} from "react-navigation";
import  { createStackNavigator }  from "react-navigation-stack";
import { createSwitchNavigator } from "react-navigation";

import SignUp from "./screens/SignUp";
import LoginPage from "./screens/Login";
import BottomTabNavigator from "./navigators/BottomTabNavigator";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator({
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: "Sign Up",
      headerStyle
    }
  },
  Login: {
    screen: LoginPage,
    navigationOptions: {
      title: "Login",
      headerStyle
    }
  }
});

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: BottomTabNavigator
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
