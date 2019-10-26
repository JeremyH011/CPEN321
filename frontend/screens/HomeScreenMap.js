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
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from '@react-native-community/geolocation';
import FetchLocation from '../components/FetchLocation';
import UsersMap from '../components/UsersMap'
import AddListingButton from '../components/AddListingButton';
import tabBarIcon from '../components/tabBarIcon';
import AddListingPage from '../components/AddListingPage';
import Listing from '../classes/Listing';
import { DB_URL } from '../key';
import SearchFilterButton from '../components/SearchFilterButton';
import SearchFilterPage from '../components/SearchFilterPage';

export default class HomeScreenMap extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('md-map'),
  };

  state = {
    userLocation: null,
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

  componentDidMount(){
    this.getListings();
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
              <UsersMap userLocation={this.state.userLocation} listingLocations={this.state.listingLocations} centerMap={this.centerMap}/>
              <SearchFilterButton onSearchFilterClicked={this.searchFilterClickedHandler}/>
              <SearchFilterPage ref='searchFilterPopup' centerMapWithDelta = {this.centerMapWithDelta} populateListingLocations={this.populateListingLocations}/>
              <AddListingButton onAddListing={this.addListingHandler}/>
              <AddListingPage ref='addListingPopup' addLocalMarker = {this.addLocalMarker} centerMap={this.centerMap} refresh={this.getListings}/>
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
