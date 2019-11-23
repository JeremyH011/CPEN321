import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, ScrollView } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import { Header } from 'react-native-elements';
import ChatRoom from '../classes/ChatRoom';
import { DB_URL } from '../key';

import tabBarIcon from '../components/tabBarIcon';
import ChatWindow from '../components/ChatWindow';
import ChatPreview from '../components/ChatPreview';

export default class Chat extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-chatboxes'),
    };

    state = {
        selectedChatteeName: null,
        selectedChatRoomId: null,
        selectedChatteeId: null,
        userId: null,
        chatRooms: []
    }

    handleChatSelect = (chatteeName, chatRoomId, chatteeId, displayModal) => {
        this.setState({selectedChatteeName: chatteeName,
                       selectedChatteeId: chatteeId,
                       selectedChatRoomId: chatRoomId});
        this.refs.chatWindowPopup.setModalVisible(displayModal, chatRoomId);
    }

    onTabPressed(){
        this.setUserId();
    }

    async setUserId(){
        this.setState({userId: await AsyncStorage.getItem('userId')});
        this.getChatRoomsByUserId();
    }

    populateChatRooms = (chatRoom) => {
        this.setState({
            chatRooms: chatRoom.map((chatRoom) => new ChatRoom(chatRoom))
        });
      }

    getChatRoomsByUserId(){
        fetch(DB_URL+`get_chat_rooms_by_user_id`, {
          method: "POST",
          headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            userId: this.state.userId,
          }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.populateChatRooms(responseJson);
        })
        .catch((error) => {
          alert(error);
        });
      }

    render() {
        return (
            <View>
                <NavigationEvents
                    onWillFocus={payload => {
                    console.log("will focus", payload);
                    this.onTabPressed();
                    }}
                />    
                <Header
                    placement="left"
                    containerStyle={styles.title}
                    centerComponent={{ text: 'CHATS', style: { color: '#FFF', fontSize: 25 } }}
                />
                {this.state.chatRooms.length == 0 && 
                      <View style={styles.noAddedChats}>
                          <Text style={styles.noAddedChatsText}>Your Chats Will be Here</Text>
                      </View>
                }
                <ScrollView style={styles.scrollView}>
                {
                    this.state.chatRooms.map((item)=>(
                        <ChatPreview 
                          chatRoomId={item.chatRoomId}
                          chatteeName={item.chatteeName}
                          chatteeId={item.chatteeId}
                          handleChatSelect={this.handleChatSelect}/>
                      ))
                  }
                </ScrollView>
                <ChatWindow 
                    ref='chatWindowPopup' 
                    chatteeName={this.state.selectedChatteeName} 
                    chatRoomId={this.state.selectedChatRoomId} 
                    currentUserId={this.state.userId} 
                    otherUserId={this.state.selectedChatteeId}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
      backgroundColor: '#8A2BE2'
    },
    noAddedChats: {
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
    },
    noAddedChatsText: {
      fontSize: 28,
      textAlign: 'center',
      justifyContent: 'center',
      margin: 15
    },
    scrollView: {
      margin:'10%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
      color:'black',
      fontSize:15,
    },
});