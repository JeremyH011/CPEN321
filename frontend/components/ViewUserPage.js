import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { DB_URL } from "../key";
import AddReviewPage from "./AddReviewPage";
import Review from "../classes/Review";

export default class ViewUserPage extends React.Component {

  state={
    modalVisible: false,
    name: "",
    age: 0,
    email: "",
    job: "",
    reviewList: []
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

  render() {
      return (
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false)}}
          >
          <NavigationEvents
            onWillFocus={payload => {
              console.log("will focus", payload);
              this.onTabPressed();
            }}
          />
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
