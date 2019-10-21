/**
 * @format
 */

import React from "react";
import {name as appName} from './app.json';
import { createRootNavigator } from "./components/router";
import { isSignedIn } from "./components/auth";
import { AppRegistry } from "react-native";
import { createAppContainer } from "react-navigation";


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    signedIn: false,
    checkedSignIn: false
  };
}

  componentDidMount() {
    isSignedIn()
    .then(res => this.setState({signedIn: res, checkedSignIn: true}))
    .catch(err => alert("An error occurred"));
  }

    render() {

      if(!this.state.checkedSignIn) {
        return null;
      }

      const Layout = createRootNavigator(this.state.signedIn);
      const AppContainer = createAppContainer(Layout);
      return <AppContainer />

  }
}


AppRegistry.registerComponent(appName, () => App);
