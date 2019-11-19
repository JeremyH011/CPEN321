import React from 'react';
import {
  View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextInputMask from 'react-native-text-input-mask';
import CheckboxFormX from 'react-native-checkbox-form';
import Review from "../classes/Review";
import { DB_URL } from "../key";

import tabBarIcon from '../components/tabBarIcon';

const data = [
  {
    label: 'Opt-in to Roommate Recommendation',
    RNchecked: false
  }
];

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    _onSelect = (item) => {
      if (this.state.newOptIn) {
        this.setState({newOptIn: false});
      } else {
        this.setState({newOptIn: true});
      }
    }
    state={
      modalVisible: true,
      loadedData: false,
      editViewVisible : false,
      userId: null,
      newName: "",
      newAge: 0,
      newEmail: "",
      newJob: "",
      newOptIn: false,
      oldName: "",
      oldAge: 0,
      oldEmail: "",
      oldJob: "",
      oldOptIn: false,
      emailError: "",
      yourReviewList: [],
      yourWrittenReviewList: [],
    }


    async handleLogOut(){
        await AsyncStorage.setItem('loggedIn', "false");
        await AsyncStorage.removeItem('userId');
        this.props.navigation.navigate('SignedOut');
    }

    async getUserData() {
      let id = await AsyncStorage.getItem('userId');
      this.setState({userId: id});
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
            userId: this.state.userId
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              oldName: responseJson[0].name,
              oldAge: responseJson[0].age,
              oldJob: responseJson[0].job,
              oldEmail: responseJson[0].email,
              oldOptIn: responseJson[0].optIn,
            });
          })
          .catch((error) => {
            console.error(error);
          });
        this.setState({loadedData: true});
        this.setState({modalVisible: false});
        this.editFields(false);
    }

    editFields(viewVisible){
      this.setState({newName: this.state.oldName, newAge: this.state.oldAge,
                    newJob: this.state.oldJob, newEmail: this.state.oldEmail,
                    newOptIn: this.state.oldOptIn});
      this.setState({editViewVisible: viewVisible});
      this.setState({emailError: ""});
    }

    updateFields(viewVisible){
      this.setState({editViewVisible : viewVisible});
      this.setState({oldName : this.state.newName});
      this.setState({oldAge : this.state.newAge});
      this.setState({oldJob : this.state.newJob});
      this.setState({oldEmail : this.state.newEmail});
      this.setState({oldOptIn : this.state.newOptIn});
      this.setState({emailError: ""});
    }

    ensureFormComplete(){
      if (this.state.newName == "") {
        alert("Must include a name!");
        return false;
      } else {
        if (this.state.newEmail == "") {
          alert("Must include an email!");
          return false;
        } else {
          return true;
        }
      }
    }

    handle_update_info() {
      if (this.ensureFormComplete()) {
        this.try_update_info()
        .then((response) => {
          if (response.status == 200) {
            this.updateFields(false);
          } else if (response.status == 401) {
            this.setState({emailError: "Account with this email already exists!"});
          } else {
            alert("Server error. Try again later!");
            this.editFields(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }

    getReviews() {
      fetch(DB_URL+`get_reviews_by_reviewee_id`, {
        method: "POST",
        headers: {
          Accept : 'application/json',
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          userId: this.state.userId,
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          yourReviewList: responseJson.map((reviewJson) => new Review(reviewJson))
        });
        console.log(this.state.yourReviewList);
      })
      .catch((error) => {
        console.error(error);
      });
      fetch(DB_URL+`get_reviews_by_reviewer_id`, {
        method: "POST",
        headers: {
          Accept : 'application/json',
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          userId: this.state.userId,
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          yourWrittenReviewList: responseJson.map((reviewJson) => new Review(reviewJson))
        });
        console.log(this.state.yourWrittenReviewList);
        })
      .catch((error) => {
        console.error(error);
      });
    }

    try_update_info = () => {
      return fetch(DB_URL+'update_user_data/', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.state.userId,
            name: this.state.newName,
            age: this.state.newAge,
            job: this.state.newJob,
            email: this.state.newEmail,
            optIn: this.state.newOptIn,
          })
      });
    }

    render() {
      if (!this.state.loadedData) {
        this.getUserData();
      }
        return (
            <ScrollView style={styles.scrollView}>
              <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setModalVisible(false);}}
                >
                <View style={styles.loading}>
                  <Text>Loading...</Text>
                </View>
              </Modal>
              <View style={styles.column}>
                <Button style={styles.buttons} color='#BA55D3' title="Edit" onPress={() => this.editFields(true)}/>
                <Button style={styles.buttons} color='#8A2BE2' title="Logout" onPress={() => this.handleLogOut()}/>
              </View>
              <View style={styles.container}>
              <View style={styles.profilePic}>
                <Image source={require('../components/Portrait_Placeholder.png')} />
              </View>
              </View>
              <View style={styles.text_box}>
                <Text style={styles.boxItem}>Name: {this.state.oldName}</Text>
                <Text style={styles.boxItem}>Email: {this.state.oldEmail}</Text>
                <Text style={styles.boxItem}>Age: {this.state.oldAge}</Text>
                <Text style={styles.boxItem}>Job: {this.state.oldJob}</Text>
              </View>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.boxItem}>Your Reviews</Text>
                {
                  this.state.yourReviewList.map((item)=>(
                    <Text style={styles.boxItem} key={item.reviewerId}>
                      {item.reviewerName}{"\n"}
                      Relationship to {item.revieweeName}: {item.relationship}{"\n"}
                      Rating: {item.reviewRating}/5{"\n"}
                      {item.reviewText}
                    </Text>
                  ))
                }
                <Text style={styles.boxItem}>Reviews You've Written</Text>
                {
                  this.state.yourWrittenReviewList.map((item)=>(
                    <Text style={styles.boxItem} key={item.reviewerId}>
                      {item.reviewerName}{"\n"}
                      Relationship to {item.revieweeName}: {item.relationship}{"\n"}
                      Rating: {item.reviewRating}/5{"\n"}
                      {item.reviewText}
                    </Text>
                  ))
                }
              </ScrollView>
              <Modal
                animationType="slide"
                visible={this.state.editViewVisible}
                onRequestClose={() => { this.setModalVisible(false);}}
              >
              <ScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                  <Text>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={this.state.oldName}
                    editable={true}
                    autoCapitalize={'words'}
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    onChangeText={(name) => this.setState({newName: name})}
                  />
                  <Text>Age</Text>
                  <TextInputMask
                    keyboardType='numeric'
                    style={styles.textInput}
                    placeholder={"Age"}
                    mask={"[99]"}
                    onChangeText={(age) => this.setState({newAge: parseInt(age)})}/>
                  <Text>Job</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={this.state.oldJob}
                    returnKeyType={'done'}
                    blurOnSubmit={false}
                    onChangeText={(job) => this.setState({newJob: job})}
                  />
                  <Text>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={this.state.oldEmail}
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    blurOnSubmit={false}
                    onChangeText={(email) => this.setState({newEmail: email})}
                  />
                  <Text style={{color: 'red'}}>{this.state.emailError}</Text>
                </View>
                <View style={styles.checkbox} >
                  <CheckboxFormX
                    style={{ width: 300 }}
                    dataSource={data}
                    itemShowKey="label"
                    itemCheckedKey="RNchecked"
                    iconColor={"#BA55D3"}
                    iconSize={32}
                    formHorizontal={false}
                    labelHorizontal={true}
                    onChecked={(item) => this._onSelect(item)}
                    />
                </View>
                <View style={styles.column}>
                  <Button style={styles.buttons} color='#BA55D3' title="Save Changes" onPress={() => this.handle_update_info()} />
                  <Button style={styles.buttons} color='#8A2BE2' title="Cancel" onPress={() => this.editFields(false)}/>
                </View>
              </ScrollView>
              </Modal>
            </ScrollView>
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
  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  checkbox: {
    flex:2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    marginHorizontal: 10
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    flexDirection:'column',
    padding: 10
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
