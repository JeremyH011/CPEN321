import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal,
  Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import { DB_URL } from "../key";
import AddReviewPage from "./AddReviewPage";
import Review from "../classes/Review";

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
    reviewList: []
  }

  _renderItem({item, index}) {
    const url ={ uri: DB_URL + item.path.replace(/\\/g, "/")};
    return (
      <Image source = {url} style={{height: 300, resizeMode : 'center', margin: 5}}/>
    );
  }

  setModalVisible(visible){
    this.getUserInfo();
    this.setState({modalVisible: visible});
    this.getReviews();
  }

  onTabPressed() {
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

  render() {
    const item = this.state.photo;
    if(item != null){
      console.log(item);
    }
      return (
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false)}}
          >
          <NavigationEvents
            onDidFocus={payload => {
              console.log("did focus", payload);
              this.onTabPressed();
            }}
            onWillFocus={payload => {
              console.log("will focus", payload);
              this.onTabPressed();
            }}
            onWillBlur={payload => {
              console.log("will blur", payload);
              this.onTabPressed();
            }}
            onDidBlur={payload => {
              console.log("did blur", payload);
              this.onTabPressed();
            }}
          />
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
                {item == null && (<Image
                  source={require('../components/Portrait_Placeholder.png')}
                  />
                )}
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
            <Button style={styles.buttons} color='#8B00C7' title="Chat"/>
            <Button style={styles.buttons} color='#BA55D3' title="Add Review" onPress={() => this.handleAddReview()}/>
            <Button style={styles.buttons} color='#8A2BE2' title="Close" onPress={() => this.setModalVisible(false)}/>
            <AddReviewPage ref='reviewPopup' revieweeId={this.props.userId} reviewerId={this.props.currentUserId}/>
          </ScrollView>
          </Modal>
      );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 10
  },
  text_box: {
    fontSize:20,
    margin: '3%',
    flex: 2,
    padding: 10
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    alignItems: 'center',
    flexDirection:'column',
    padding: 10
  },
  profilePic: {
    width: 250,
    height: 250,
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
    fontSize:20,
    margin: '3%'
  },
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding: 10
  }
});
