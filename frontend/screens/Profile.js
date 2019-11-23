import React from 'react';
import {
  View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import TextInputMask from 'react-native-text-input-mask';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Carousel from 'react-native-snap-carousel';
import ImagePicker from 'react-native-image-picker';
import Review from "../classes/Review";
import User from "../classes/User";
import { DB_URL } from "../key";

import tabBarIcon from '../components/tabBarIcon';

const radio_props = [
  {label: 'Yes', value: true},
  {label: 'No', value: false}
];

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

export default class Profile extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-person'),
    };

    _renderItem({item, index}) {
      const url ={ uri: DB_URL + item.path.replace(/\\/g, "/")};
      return (
        <Image source = {url} style={{height: 300, resizeMode : 'center', margin: 5}}/>
      );
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
      oldPhoto: [],
      newPhoto: null,
      photoChanged: false
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

    onTabPressed() {
      this.getUserData();
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
              oldPhoto: responseJson[0].photo
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

    createFormData(body){
      let data = new FormData();

      data.append("photo", {
        name: this.state.newPhoto.fileName,
        type: this.state.newPhoto.type,
        uri:
          Platform.OS === "android" ? this.state.newPhoto.uri : photo.uri.replace("file://", "")
      });
      Object.keys(body).forEach(key => {
        data.append(key, body[key]);
      });

      return data;
    }

    handle_update_info() {
      if (this.ensureFormComplete()) {
        this.try_update_info()
        .then((response) => {
          if (response.status == 200) {
            if (this.state.photoChanged) {
              this.try_update_photo()
              .then((response) => {
                if (response.status == 200) {
                  this.onTabPressed();
                } else {
                  alert("Server error. Try again later!");
                  this.editFields(false);
                }
              })
              .catch((error) => {
                console.error(error);
              });
              this.resetPhotos();
            }
          } else if (response.status == 401) {
            this.setState({emailError: "Account with this email already exists!"});
          } else {
            alert("Server error. Try again later!");
            this.editFields(false);
            this.resetPhotos();
          }
        })
        .catch((error) => {
          console.error(error);
        });
        this.onTabPressed();
      }
    }

    _renderItem ({item, index}) {
      const url = { uri: DB_URL + item.path.replace(/\\/g, "/")};
      return (
        <Image source = {url} style = {{height: 300, resizeMode : 'center', margin: 5 }}/>
      );
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

    handleChoosePhoto() {
      const options = {
        noData: true,
      }
      ImagePicker.launchImageLibrary(options, response => {
        if (response.uri) {
          this.setState({newPhoto:response});
          this.setState({photoChanged: true});
        }
      });
    }

    try_update_info() {
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

    try_update_photo() {
      let body = {
        userId: this.state.userId,
      };
      return fetch(DB_URL+'update_user_photo/', {
          method: 'POST',
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          body: this.createFormData(body),
      });
    }

    resetPhotos(){
      this.setState({photoChanged: false});
      this.setState({newPhoto: []});
    }

    render() {
      if (!this.state.loadedData) {
        this.getUserData();
      }
      const item = this.state.oldPhoto;
      if(item != null){
        console.log("this is oldPhoto data:" + item);
      }
      const {newPhoto} = this.state;
        return (
            <ScrollView style={styles.scrollView}>
            <NavigationEvents
              onWillFocus={payload => {
                console.log("will focus", payload);
                this.onTabPressed();
              }}
            />
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
                <Text style={styles.boxItem}>Name: {this.state.oldName}</Text>
                <Text style={styles.boxItem}>Email: {this.state.oldEmail}</Text>
                <Text style={styles.boxItem}>Age: {this.state.oldAge}</Text>
                <Text style={styles.boxItem}>Job: {this.state.oldJob}</Text>
              </View>
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
                  <Text>Opt-in to Roommate Recommendation feature</Text>
                  <RadioForm
                    radio_props={radio_props}
                    initial={0}
                    formHorizontal={true}
                    labelHorizontal={false}
                    buttonColor={'#8A2BE2'}
                    selectedButtonColor={'#8A2BE2'}
                    animation={true}
                    onPress={(value) => {this.setState({newOptIn:value})}}
                  />
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  {newPhoto && (
                    <Image
                      source={{ uri: newPhoto.uri }}
                      style={{ width: 150, height: 150 }}
                    />
                  )}
                </View>
                <View style={styles.column}>
                  <Button style={styles.buttons} color='#A80097' title="Choose a Profile Photo" onPress={() => {this.handleChoosePhoto()}}/>
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
    flex: 6,
  },
  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  column: {
    flex: 1,
    justifyContent : 'space-around',
    flexDirection:'column',
    padding: 10
  },
  profilePic: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    padding: 10
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
