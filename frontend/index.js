/**
 * @format
 */

import React from "react";
import {name as appName} from './app.json';
import { createRootNavigator } from "./router";
import { isSignedIn } from "./auth";
import { AppRegistry } from "react-native";
import { createAppContainer } from "react-navigation";


export default class App extends React.Component {

  /*createLayoutNav = () => {
    if (this.state.checkedSignIn) {
      return null;
    } else {
      Layout = createRootNavigator(this.state.signedIn);
      return createAppContainer(Layout);
    }
  }*/

 //const AppContainer = createAppContainer(this.createLayoutNav);

    render() {
    /*  isSignedIn()
           .then(res => signedIn = res)
           .catch(err => alert("An error occurred"));*/
    return <AppContainer />;
  }
}

const signedIn = false;

const Layout = createRootNavigator(signedIn);


const AppContainer = createAppContainer(Layout);
AppRegistry.registerComponent(appName, () => App);
