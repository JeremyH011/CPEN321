import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal } from 'react-native';
import { DB_URL } from "../key";
import AddReviewPage from "./AddReviewPage";
import Review from "../classes/Review";
import ChatWindow from "./ChatWindow";

export default class ViewUserPage extends React.Component {

  state={
    modalVisible: false,
    name: "",
    age: 0,
    email: "",
    job: "",
    reviewList: [],
    chatRoomId: null,
  }

  setModalVisible(visible){
    this.getUserInfo();
    this.setState({modalVisible: visible});
    this.getReviews();
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

  getReviews() {
    fetch(DB_URL+`get_reviews_by_reviewee_id`, {
      method: "POST",
      headers: {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.userId,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        reviewList: responseJson.map((reviewJson) => new Review(reviewJson))
      });
      console.log(this.state.reviewList);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleAddReview() {
    this.refs.reviewPopup.setModalVisible(true);
  }

  getChatRoomByUserIds(){
    fetch(DB_URL+`get_chat_room_by_user_ids`, {
      method: "POST",
      headers: {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        otherUserId: this.props.userId,
        currentUserId: this.props.currentUserId,
      }),
    })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else if (response.status == 401){
        this.createChatRoom();
      } else {
        alert("Server error. Try again later!");
      }
    })
    .then((responseJson) => {
      if (responseJson) {
        this.setState({
          chatRoomId: responseJson.chatRoomId
        });
        this.refs.chatWindowPopup.setModalVisible(true, responseJson.chatRoomId);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  createChatRoom(){
    fetch(DB_URL+`create_chat_room`, {
      method: "POST",
      headers: {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        userId1: this.props.userId,
        userId2: this.props.currentUserId,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson) {
        this.setState({
          chatRoomId: responseJson.chatRoomId
        });
        this.refs.chatWindowPopup.setModalVisible(true, responseJson.chatRoomId);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  openChatHandler(){
    // search for a chat room by curr User Id and other user ID
      // return chat room ID if found or null if not
      // if null then call create chat room api (return chat room ID)
    // call get messagesByChatRoomID on the chat window
    // open the chat window
    this.getChatRoomByUserIds();
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
            <ScrollView style={styles.scrollView}>
            <Text style={styles.boxItem}>Reviews</Text>
              {
                this.state.reviewList.map((item)=>(
                  <Text style={styles.boxItem} key={item.reviewerId}>
                    Written by: {item.reviewerName}{"\n"}
                    Relationship to {item.revieweeName}: {item.relationship}{"\n"}
                    Rating: {item.reviewRating}/5{"\n"}
                    {item.reviewText}
                  </Text>
                ))
              }
            </ScrollView>
            <Button style={styles.buttons} color='#BA55D3' title="Chat" onPress={() => this.openChatHandler()}/>
            <Button style={styles.buttons} color='#BA55D3' title="Add Review" onPress={() => this.handleAddReview()}/>
            <Button style={styles.buttons} color='#8A2BE2' title="Close" onPress={() => this.setModalVisible(false)}/>
            <ChatWindow ref='chatWindowPopup' chatteeName={this.state.name} chatRoomId={this.state.chatRoomId} currentUserId={this.props.currentUserId} otherUserId={this.props.userId}/>
            <AddReviewPage ref='reviewPopup' revieweeId={this.props.userId} reviewerId={this.props.currentUserId}/>
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
