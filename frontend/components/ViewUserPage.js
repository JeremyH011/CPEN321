import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal,
  Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { DB_URL } from "../key";
import AddReviewPage from "./AddReviewPage";
import Review from "../classes/Review";
import Listing from "../classes/Listing";
import MyListing from "../components/MyListing";
import ListingPage from "../components/ListingPage";
import ChatWindow from "./ChatWindow";

const {width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class ViewUserPage extends React.Component {

  state={
    modalVisible: false,
    name: "",
    age: 0,
    email: "",
    job: "",
    photo: null,
    loaded: false,
    reviewList: [],
    chatRoomId: null,
    listingList: [],
    selectedListing: null,
    selectedListingModalVisible: false,
  }

  _renderItem({item, index}) {
    const url ={ uri: DB_URL + item.path.replace(/\\/g, "/")};
    return (
      <Image source = {url} style={{height: 300, width: 300, borderRadius: 300/2, resizeMode : 'center'}}/>
    );
  }

  getInfo() {
    this.getUserInfo();
    this.getReviews();
    this.getListings();
    this.setState({loaded: true});
  }

  refreshReviews = () => {
    this.getUserInfo();
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
            email: responseJson[0].email,
            photo: responseJson[0].photo
          });
        })
        .catch((error) => {
          alert(error);
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
      alert(error);
    });
  }

  getListings() {
    fetch(DB_URL+`get_listings_by_userId`, {
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
        listingList: responseJson.map((listingsJson) => new Listing(listingsJson))
      });
      console.log(this.state.listingList);
    })
    .catch((error) => {
      alert(error);
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
      alert(error);
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
      alert(error);
    });
  }

  handleListingSelect = (listing, displayModal) => {
      this.setState({selectedListing:listing,
                     selectedListingModalVisible: displayModal});
  }

  handleSelectedListingModalClose = () => {
      this.setState({selectedListingModalVisible: false});
      this.state.listingList = [];
      this.getListings();
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
    const item = this.state.photo;
    if(item != null){
      console.log(item);
    }
    if(this.props.visible && !this.state.loaded) {
      this.getInfo();
    }
      return (
        <Modal
          animationType="slide"
          visible={this.props.visible}
          onRequestClose={this.props.close}
          style={{flex: 1}}
          >
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              <View style={styles.profilePic}>
                {item != null && (<Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={Array.from(item)}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  />
                )}
                {item == null && (
                  <Image
                    source={require('../components/Portrait_Placeholder.png')}
                    style={{height: 300, width: 300, borderRadius: 300/2, resizeMode : 'center'}}
                  />
                )}
              </View>
            </View>
            <View style={styles.text_box_prof}>
              <Text style={styles.boxItem_h1}>{this.state.name}</Text>
              <Text style={styles.boxItem}>Email: {this.state.email}</Text>
              <Text style={styles.boxItem}>Age: {this.state.age}</Text>
              <Text style={styles.boxItem}>Job: {this.state.job}</Text>
            </View>
            <View style={styles.text_box}>
              <Text style={styles.boxItem_h2}>Reviews</Text>
              <View
                style={{
                  borderBottomWidth: 5,
                  borderColor:'#DDDDDD',
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 20
                }}
              />
                {
                  this.state.reviewList.map((item)=>(
                    <Text style={styles.boxItem} key={item.reviewerId}>
                      {item.reviewerName}{"\n"}
                      Relationship to {item.revieweeName}: {item.relationship}{"\n"}
                      Rating: {item.reviewRating}/5{"\n"}
                      {item.reviewText}
                    </Text>
                  ))
                }
                {
                  this.state.reviewList.length == 0 &&
                  <Text style={styles.boxItem}>This user has no reviews!</Text>
                }
                <Text style={styles.boxItem_h2}>Listings</Text>
                <View
                  style={{
                    borderBottomWidth: 5,
                    borderColor:'#DDDDDD',
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}
                />
                {
                  this.state.listingList.map((item)=>(
                    <MyListing
                        listing={item}
                        handleListingSelect={this.handleListingSelect}>
                    </MyListing>
                  ))
                }
                {
                  this.state.listingList.length == 0 &&
                  <Text style={styles.boxItem}>This user has created no listings!</Text>
                }
            </View>
            <AddReviewPage ref='reviewPopup' refreshReviews={this.refreshReviews} revieweeId={this.props.userId} reviewerId={this.props.currentUserId}/>
            <ChatWindow ref='chatWindowPopup' chatteeName={this.state.name} chatRoomId={this.state.chatRoomId} currentUserId={this.props.currentUserId} otherUserId={this.props.userId}/>
            <ListingPage
              {...this.state.selectedListing}
              visible={this.state.selectedListingModalVisible}
              close={this.handleSelectedListingModalClose}
              currentUserId = {this.props.currentUserId}
              allowViewProfile = {false}
            />
          </ScrollView>
            { this.props.allowChat &&
              <Button style={styles.buttons} color='#8B00C7' title="Chat" onPress={() => this.openChatHandler()}/>
            }
            <Button style={styles.buttons} color='#BA55D3' title="Add Review" onPress={() => this.handleAddReview()}/>
            <Button style={styles.buttons} color='#8A2BE2' title="Close" onPress={this.props.close}/>
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
    padding: 10
  },
  text_box_prof: {
    fontSize:20,
    flex: 2,
    padding: 10,
    justifyContent:'center',
    alignItems:'center',
    //borderWidth:1,
    //borderColor:'black'
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    alignItems: 'center',
    flexDirection:'column',
    padding: 10
  },
  profilePic: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  buttons: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    padding: 10,
  },
  boxItem:{
    fontSize:16,
    margin: '3%'
  },
  boxItem_h1:{
    fontSize:40,
    margin: '3%'
  },
  boxItem_h2:{
    fontSize:30,
    margin: '3%',
    textAlign:'center'
  },
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding: 10
  }
});
