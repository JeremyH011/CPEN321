import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ImageBackground} from 'react-native';

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
            alert(error);
          });
    }

    render() {
        return (
          <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false);}}
          >
            <ImageBackground
              source={require('./background_2.png')}
              style={{width: '100%', height: '100%'}}
            >
              <View style={styles.title}>
                <Text style={styles.textTitle}>RECOMMENDED ROOMMATES</Text>
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
            </ImageBackground>
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
    },
    scrollView: {
      width: '95%',
      marginLeft: '2.5%',
      marginRight: '2.5%',
      marginBottom: '2.5%',
    },
    modalButton: {
      alignItems: 'center',
      padding: 10,
      width: '100%',
      backgroundColor:'#8A2BE2',
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
