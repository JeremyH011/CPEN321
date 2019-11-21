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
import { Header } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import Message from "../classes/Message";
import InputBar from "./InputBar";
import MessageBubble from './MessageBubble';

export default class ChatWindow extends React.Component {
    // https://www.npmjs.com/package/react-chat-bubble

    state = {
        modalVisible: false,
        messages: [],
        currMsgContent: "",
    }

    setModalVisible(visible, chatRoomId) {
      if(visible)
      {
        this.getMessagesByChatRoomID({"chatRoomId":chatRoomId});
      }
      this.setState({modalVisible: visible});
    }

    createMessage(){
        fetch(DB_URL+`create_message`, {
          method: "POST",
          headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            receiverId: this.props.otherUserId,
            senderId: this.props.currentUserId,
            content: this.state.currMsgContent,
            chatRoomId: this.props.chatRoomId,
          }),
        }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson) {
            this.setState({
              chatRoomId: responseJson.chatRoomId
            });
          }
          this.setState({currMsgContent: ''});
          this.getMessagesByChatRoomID({"chatRoomId":this.props.chatRoomId});
        })
        .catch((error) => {
          console.error(error);
        });
      }

    getMessagesByChatRoomID(body){
        console.log(body);
      fetch(DB_URL+`get_messages_by_chatroom_id?chatRoomId=${body.chatRoomId}`, {
          method: "POST",
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              messages: responseJson.map((msgJson) => new Message(msgJson))
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
          onRequestClose={() => { this.setModalVisible(false);}}
          >
            <Header
            placement="left"
            containerStyle={styles.title}
            leftComponent={ <MaterialIcons
                                style={{ backgroundColor: 'transparent'}}
                                name={'md-arrow-round-back'}
                                color={'#FFF'}
                                size={30}
                                onPress={() => {this.setModalVisible(false);}}
                            />}
            centerComponent={{ text: this.props.chatteeName, style: { color: '#FFF', fontSize: 25 } }}
            />

            <View style={styles.outer}>
                  <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
                    {
                        this.state.messages.map((msg)=>(
                            <MessageBubble 
                                direction={this.props.currentUserId == msg.senderId ? 'right' : 'left'}
                                text={msg.content}/>
                        ))
                    }
                  </ScrollView>
                  <InputBar onSendPressed={() => this.createMessage()}
                      onChangeText={(text) => this.setState({currMsgContent: text})}
                      text={this.state.currMsgContent}/>            
              </View>
          </Modal>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 7,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white'
      },
    
      messages: {
        flex: 1
      },
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
    },
    scrollView: {
      margin:'5%',
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
      color:'rgba(0,0,0,0.5)',
      fontSize:15
    },
    boxItem:{
      fontSize:20,
      margin: '5%',
    }
});
