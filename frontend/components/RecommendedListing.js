import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView} from 'react-native';

import { DB_URL } from '../key';
import User from '../classes/User';
import MyRoommates from './MyRoommates';
import ViewUserPage from './ViewUserPage';

export default class Recommended extends React.Component {

    state = {
        modalVisible: false,
        scrollViewVisible: false,
        recommended: [],
        selectedUser: null,
        selectedUserModalVisible: false
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    handleUserSelect = (userId, displayModal) => {
      this.setState({selectedUser:userId, selectedUserModalVisible: displayModal});
    }

    handleCloseModal = () => {
      this.setState({selectedUserModalVisible: false});
    }

    getRecommendedUsers(body){
      fetch(DB_URL+`get_recommended_roommates?userId=${body.userId}`, {
          method: "GET",
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              recommended: responseJson.map((listingJson) => new User(listingJson))
            });
            console.log(this.state.recommended);
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
          onRequestClose={() => { this.setModalVisible(false);}}
          >
            <View style={styles.title}>
              <Text style={styles.textTitle}>RECOMMENDED</Text>
            </View>
            <View style={styles.modal}>
              <ScrollView style={styles.scrollView}>
                {
                  this.state.recommended.map((item)=>(
                    <MyRoommates
                      user={item}
                      handleUserSelect={this.handleUserSelect}>
                    </MyRoommates>
                  ))
                }
              </ScrollView>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.modalButton} onPress={() => {this.setModalVisible(false);}}>
                    <Text style={styles.text}>Back</Text>
                </TouchableOpacity>
            </View>
            <ViewUserPage
              ref="viewUserPopup"
              visible={this.state.selectedUserModalVisible}
              close={this.handleCloseModal}
              userId = {this.state.selectedUser}
              currentUserId = {this.props.currentUserId}
              allowChat = {true}
            />
          </Modal>
        );
    }
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#8A2BE2'
    },
    modal: {
      flex: 14,
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      borderColor:'red',
      borderWidth:1
    },
    scrollView: {
      margin:'5%',
      width: '95%',
    },
    modalButton: {
      alignItems: 'center',
      margin: 10,
      padding: 10,
      width: '80%',
      borderRadius: 150 / 2,
      backgroundColor:'#BA55D3',
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
      color:'white',
      fontSize:15
    },
    boxItem:{
      fontSize:20,
      margin: '5%',
    }
});
