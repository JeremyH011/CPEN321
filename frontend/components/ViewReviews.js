import React from 'react'
import { View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Modal } from 'react-native';
import { DB_URL } from "../key";
import Review from "../classes/Review";

export default class ViewUserPage extends React.Component {

  state={
    modalVisible: false,
    reviewList: []
  }

  setModalVisible(visible, reviewee){
    this.getReviews(reviewee);
    this.setState({modalVisible: visible});
  }

  getReviews(reviewee) {
    if (reviewee) {
      fetch(DB_URL+`get_reviews_by_reviewee_id`, {
        method: "POST",
        headers: {
          Accept : 'application/json',
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.revieweeId,
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
    } else {
      fetch(DB_URL+`get_reviews_by_reviewer_id`, {
        method: "POST",
        headers: {
          Accept : 'application/json',
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          userId: this.props.reviewerId,
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
  }

  render() {
      return (
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false)}}
          >
          <ScrollView style={styles.scrollView}>
            {
              this.state.reviewList.map((item)=>(
                <Text style={styles.boxItem} key={item.reviewerId}>
                  {item.reviewerName}{"\n"}
                  Posted on {item.date}{"\n"}
                  Relationship to {item.revieweeName}: {item.relationship}{"\n"}
                  Rating: {item.reviewRating}/5{"\n"}
                  {item.reviewText}
                </Text>
              ))
            }
          </ScrollView>
            <Button style={styles.buttons} color='#8A2BE2' title="Close" onPress={() => this.setModalVisible(false)}/>
          </Modal>
      );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    backgroundColor: '#DDDDDD',
    margin: 10,
    right: 0,
    bottom: 30
  },
  boxItem:{
    fontSize:20,
    margin: '3%',
  }
});
