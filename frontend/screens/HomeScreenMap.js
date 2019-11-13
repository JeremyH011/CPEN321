/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from '@react-native-community/geolocation';
import FetchLocation from '../components/FetchLocation';
import UsersMap from '../components/UsersMap'
import AddListingButton from '../components/AddListingButton';
import RecommendedListingButton from '../components/RecommendedListingButton';
import RecommendedListing from '../components/RecommendedListing';
import tabBarIcon from '../components/tabBarIcon';
import AddListingPage from '../components/AddListingPage';
import Listing from '../classes/Listing';
import { DB_URL } from '../key';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import SearchFilterButton from '../components/SearchFilterButton';
import SearchFilterPage from '../components/SearchFilterPage';

export default class HomeScreenMap extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('md-map'),
  };

  state = {
    userLocation: null,
    userId: null,
    listingLocations: [],
  }

  getUserLocationHandler = () => {
    Geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
        }
      });
    }, err => console.log(err));
  }

  searchFilterClickedHandler = () => {
    this.refs.searchFilterPopup.setModalVisible(true);
  }

  addListingHandler = () => {
    this.refs.addListingPopup.setModalVisible(true);
  }

  getRecommendedHandler = () => {
    this.refs.getRecommendedPopup.getRecommendedUsers({"userId":this.state.userId});
    this.refs.getRecommendedPopup.setModalVisible(true);
  }

  componentDidMount(){
    this.checkPermission();
    this.createNotificationListeners();
    this.getListings();
  }

  async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}

async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
  this.setState({userId: await AsyncStorage.getItem('userId')}); 
  this.addFCMTokenToDB(fcmToken, this.state.userId);
}

addFCMTokenToDB = (token, id) => {
  return fetch(DB_URL+'add_user_fcm_token/', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId: id,
          token: token,
      }),
  });
}

async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      console.log('permission granted');
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
  }
}

//Remove listeners allocated in createNotificationListeners()
componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

async createNotificationListeners() {
/*
* Triggered when a particular notification has been received in foreground
* */
this.notificationListener = firebase.notifications().onNotification((notification) => {
    const { title, body } = notification;
    this.showAlert(title, body);
});

/*
* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
* */
this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    const { title, body } = notificationOpen.notification;
    this.showAlert(title, body);
});

/*
* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
* */
const notificationOpen = await firebase.notifications().getInitialNotification();
if (notificationOpen) {
    const { title, body } = notificationOpen.notification;
    this.showAlert(title, body);
}
/*
* Triggered for data only payload in foreground
* */
this.messageListener = firebase.messaging().onMessage((message) => {
  //process data message
  console.log(JSON.stringify(message));
});
}

showAlert(title, body) {
Alert.alert(
  title, body,
  [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
  ],
  { cancelable: false },
);
}

  addLocalMarker = (listing) => {
    this.setState({
      listingLocations: [
        ...this.state.listingLocations,
        listing
      ]
  })
  }

  centerMap = (lat,long) => {
    this.setState({
      userLocation: {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0421,
      }
    });
  }

  centerMapWithDelta = (lat, long, latDelta, longDelta) => {
    this.setState({
      userLocation: {
        latitude: lat,
        longitude: long,
        latitudeDelta: latDelta,
        longitudeDelta: longDelta,
      }
    });
  }

  populateListingLocations = (listingsJson) => {
    this.setState({
      listingLocations: listingsJson.map((listingJson) => new Listing(listingJson))
    });
  }

  getListings = () => {
    return fetch(DB_URL+'get_listings/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.populateListingLocations(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
    }

  render () {
    return (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.container}>
              <FetchLocation onGetLocation={this.getUserLocationHandler} />
              <UsersMap userLocation={this.state.userLocation} listingLocations={this.state.listingLocations} centerMap={this.centerMap} userId={this.state.userId}/>
              <SearchFilterButton onSearchFilterClicked={this.searchFilterClickedHandler}/>
              <SearchFilterPage ref='searchFilterPopup' userId = {this.state.userId} centerMapWithDelta = {this.centerMapWithDelta} populateListingLocations={this.populateListingLocations}/>
              <RecommendedListingButton onRecommended={this.getRecommendedHandler}/>
              <AddListingButton onAddListing={this.addListingHandler}/>
              <RecommendedListing ref='getRecommendedPopup'/>
              <AddListingPage ref='addListingPopup' addLocalMarker = {this.addLocalMarker} userId = {this.state.userId} getListings={this.getListings} centerMap={this.centerMap} refresh={this.getListings}/>
            </View>
          </ScrollView>
    );
  };
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  }
});
