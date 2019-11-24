import React from 'react'
import { View,
    StyleSheet,
    Text,
    Modal,
    TextInput,
    ScrollView,
    Button } from 'react-native';
import { DB_URL } from '../key';
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

export default class AddReviewPage extends React.Component {

    state = {
        modalVisible: false,
        rating: 0,
        relationship: "",
        text: " ",
        revieweeName: " ",
        reviewerName: " ",
        reviewerId: ""
    }

    async getUserData() {
      let id = await AsyncStorage.getItem('userId');
      this.setState({revieweeId: id});
      this.getUserInfo(id, false);
    }

    getUserInfo(id, reviewee){
      fetch(DB_URL+`get_user_by_id/`, {
          method: "POST",
          headers: {
            Accept : 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: id
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (reviewee) {
              if (responseJson[0].name != "") {
                this.setState({ revieweeName: responseJson[0].name });
              }
            } else {
              if (responseJson[0].name != "") {
                this.setState({ reviewerName: responseJson[0].name });
              }
            }
          })
          .catch((error) => {
            alert(error);
          });
    }

    resetReviewForm() {
      this.setState({rating: 0});
      this.setState({relationship: ""});
      this.setState({text: " "});
      this.setModalVisible(false);
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
      this.getUserData();
      this.getUserInfo(this.props.revieweeId, true);
    }

    handleSubmitReview() {
      if (this.ensureFormComplete()) {
        this.try_submit_review()
        .then((response) => {
          if (response.status == 200) {
            this.setModalVisible(false);
            this.props.refreshReviews();
          } else {
            alert("Server error. Try again later!");
            this.setModalVisible(false);
          }
        })
        .catch((error) => {
          alert(error);
        });
      }
    }

    try_submit_review = () => {
      return fetch(DB_URL+`create_review/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revieweeId: this.props.revieweeId,
          reviewerId: this.props.reviewerId,
          reviewerName: this.state.reviewerName,
          revieweeName: this.state.revieweeName,
          relationship: this.state.relationship,
          reviewRating: this.state.rating,
          reviewText: this.state.text
        })
      });
    }

    ensureFormComplete() {
      if(this.state.rating == 0) {
        alert("Must include a rating");
        return false;
      } else {
        if(this.state.relationship == "") {
          alert("Please include your relationship from the dropdown menu");
          return false;
        } else {
          return true;
        }
      }
    }

    render() {
        return (
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => { this.setModalVisible(false); } }>
              <View style={styles.title}>
                <Text style={styles.textTitle}>WRITE A REVIEW</Text>
              </View>
              <ScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                  <View style={styles.form}>
                    <View style={styles.row}>
                      <View style={styles.dropdown}>
                        <Dropdown
                          label='Rating'
                          data={ratingList}
                          onChangeText={(text) => this.setState({rating: parseInt(text)})}
                        />
                      </View>
                      <View style={styles.dropdown}>
                        <Dropdown
                          label='Relationship'
                          data={relationshipList}
                          onChangeText={(text) => this.setState({relationship: text})}
                        />
                      </View>
                    </View>
                    <Text style={{margin:10}}>Let others know what you think of {this.state.revieweeName} (Max. 1000 characters)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={"Review (optional)"}
                      editable={true}
                      autoCapitalize={'sentences'}
                      textAlignVertical={'top'}
                      maxLength={1000}
                      multiline
                      numberOfLines={10}
                      onChangeText={(review) => this.setState({text: review})}/>
                  </View>
                  <View style={styles.column}>
                    <Button style={styles.buttons} color='#BA55D3' title="Submit Review" onPress={() => this.handleSubmitReview()} />
                    <Button style={styles.buttons} color='#8A2BE2' title="Cancel" onPress={() => this.resetReviewForm()}/>
                  </View>
                </View>
              </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
      flex: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      height: 300,
      width: 300,
      borderWidth: 1,
      margin: 10,
      padding: 10,
    },
    scrollView: {
      flex: 10,
    },
    row: {
        flexDirection: 'row',
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown: {
        flex: 1,
        margin: 10,
        padding: 10,
    },
    container: {
      flex:8,
      justifyContent:'center',
    },
    form: {
      flex:8,
      justifyContent: 'center',
      alignItems:'center'
    },
    title: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#8A2BE2'
    },
    textTitle: {
      fontSize:15,
      color:'white'
    },
    column: {
      flex: 1,
      justifyContent : 'space-around',
      flexDirection:'column',
      padding: 10
    },
    buttons: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
    }
});

const ratingList = [
  {value: '1'},
  {value: '2'},
  {value: '3'},
  {value: '4'},
  {value: '5'},
];

const relationshipList = [
  {value: "Landlord"},
  {value: "Tenant"},
  {value: "Roommate"},
];
