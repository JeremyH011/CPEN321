import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal } from 'react-native';
import { DB_URL } from "../key";
import Chat from "../screens/Chat"

export default class ViewUserPage extends React.Component {

  state={
    modalVisible: false,
    name: "",
    age: 0,
    email: "",
    job: ""
  }

  setModalVisible(visible){
    this.setState({clicked: true});
    this.getUserInfo();
    this.setState({modalVisible: visible});
  }

  getUserInfo(){
    fetch(DB_URL+`get_user_by_id/`, {
        method: "POST",
        headers: {
          Accept : 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.userId
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            name: responseJson[0].name,
            age: responseJson[0].age,
            job: responseJson[0].job,
            email: responseJson[0].email
          });
        })
        .catch((error) => {
          console.error(error);
        });
  }

  render() {
      return (
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false)}}
          >
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
            <View style={styles.profilePic}>
              <Image source={require('../components/Portrait_Placeholder.png')} />
            </View>
            </View>
            <View style={styles.text_box}>
              <Text style={styles.boxItem}>Name: {this.state.name}</Text>
              <Text style={styles.boxItem}>Email: {this.state.email}</Text>
              <Text style={styles.boxItem}>Age: {this.state.age}</Text>
              <Text style={styles.boxItem}>Job: {this.state.job}</Text>
            </View>
            <Button style={styles.buttons} color='#BA55D3' title="Chat" onPress={() => ()}/>
            <Button style={styles.buttons} color='#8A2BE2' title="Close" onPress={() => this.setModalVisible(false)}/>
          </ScrollView>
          </Modal>
      );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  text_box: {
    fontSize:20,
    margin: '3%',
    flex: 2,
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    alignItems: 'center',
    flexDirection:'column'
  },
  profilePic: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    padding: 10,
  },
  boxItem:{
    fontSize:20,
    margin: '3%',
  },
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  }
});
