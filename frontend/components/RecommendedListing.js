import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView} from 'react-native';

import { API_KEY, DB_URL } from '../key';
import User from '../classes/User';

export default class Recommended extends React.Component {

    state = {
        modalVisible: false,
        scrollViewVisible: false,
        recommended: ["Item1", "Item2", "Item3"]
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    getRecommendedUsers(body){
      fetch(DB_URL+`get_users?user_name=${body.user_name}`, {
          method: "GET",
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              recommended: responseJson.map((listingJson) => new User(listingJson))
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
          >
            <View style={styles.title}>
              <Text style={styles.textTitle}>RECOMMENDED</Text>
            </View>
            <View style={styles.modal}>
              <ScrollView style={styles.scrollView}>
                {
                  this.state.recommended.map((item,key)=>(
                    <Text key={key}> { item } </Text>
                  ))
                }
              </ScrollView>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.setModalVisible(false);}}>
                    <Text style={styles.text}>Back</Text>
                </TouchableOpacity>
            </View>
          </Modal>
        );
    }
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2199e8'
    },
    modal: {
      flex: 14,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    scrollView: {
      margin:'5%',
      flex:1,
      flexDirection: 'row',
    },
    modalButton: {
      alignItems: 'center',
      margin: 10,
      padding: 10,
      width: '80%',
      borderRadius: 150 / 2,
      backgroundColor:'rgb(3, 218, 196)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textTitle: {
      fontSize:15,
      color:'white'
    },
    text: {
      color:'rgba(0,0,0,0.5)',
      fontSize:15
    }
});
