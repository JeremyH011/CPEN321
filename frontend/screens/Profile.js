import React from 'react';
import {
  View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../classes/User';
import { DB_URL } from "../key";

import tabBarIcon from '../components/tabBarIcon';

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    state={
      userInfo: [],
      modalVisible: true,
      loadedData: false,
      userId: null
    }


    async handleLogOut(){
        await AsyncStorage.setItem('loggedIn', "false");
        await AsyncStorage.removeItem('userId');
        this.props.navigation.navigate('SignedOut');
    }

    async getUserData() {
      let id = await AsyncStorage.getItem('userId');
      this.setState({userId: id});
      this.getUserInfo({"userId":this.state.userId});
    }

    getUserInfo(body){
      fetch(DB_URL+`get_user_by_id?userId=${body.userId}`, {
          method: "GET",
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              userInfo: responseJson.map((userJson) => new User(userJson))
            });
            console.log(this.state.userInfo);
          })
          .catch((error) => {
            console.error(error);
          });
        this.setState({loadedData: true});
        this.setState({modalVisible: false});
    }


    render() {
      if (!this.state.loadedData) {
        this.setState({loadedData: true});
      //  this.setState({modalVisible: true});
        this.getUserData();
      }
        return (

            <ScrollView style={styles.scrollView}>
              <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setModalVisible(false);}}
                >
                <View style={styles.loading}>
                  <Text>Loading...</Text>
                </View>
              </Modal>
              <View style={styles.profilePic}>
                <Image source={require('../components/Portrait_Placeholder.png')} />
              </View>
              {
                this.state.userInfo.map((item)=>(
                  <Text style={styles.boxItem} key={item.email}>
                    Name: {item.name}{"\n"}
                    Age: {item.age}{"\n"}
                    Job: {item.job}
                  </Text>
                ))
              }
              <Button title="Logout" onPress={() => this.handleLogOut()}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  text_box: {
    fontSize:20,
    margin: '5%'
  },
  profilePic: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
