import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import { Header } from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';

import tabBarIcon from '../components/tabBarIcon';
import Listing from '../classes/Listing';
import { AsyncStorage } from 'react-native';
import { DB_URL } from '../key';
import ListingPage from '../components/ListingPage';
import MyListing from '../components/MyListing';

export default class Listings extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-list-box'),
    };

    state = {
        selectedListing: null,
        selectedListingModalVisible: false,
        userId: null,
        addedListings: []
    }

    handleListingSelect = (listing, displayModal) => {
      if (this.state.selectedListing) {
        this.state.selectedListing.tapped = false;
      }

      this.setState({selectedListing:listing,
                     selectedListingModalVisible: displayModal});
    }

    handleCloseModal = () => {
      this.setState({selectedListingModalVisible: false});
      this.state.addedListings = [];
      this.getAddedListings();
    }

    onTabPressed(){
        this.setUserId();
    }

    async setUserId(){
        this.setState({userId: await AsyncStorage.getItem('userId')});
        this.getAddedListings();
    }

    populateAddedListings = (listingsJson) => {
      this.setState({
        addedListings: listingsJson.map((listingJson) => new Listing(listingJson))
      });
    }

    getAddedListings(){
        fetch(DB_URL+`get_listings_by_userId/`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.state.userId
            }),
          }).then((response) => response.json())
            .then((responseJson) => {
              this.populateAddedListings(responseJson);
            })
            .catch((error) => {
              alert(error);
            });
      }

    render() {
        return (
          <ImageBackground
            source={require('../components/background_2.png')}
            style={{width: '100%', height: '100%'}}
          >
            <View>
              <NavigationEvents
                onWillFocus={payload => {
                  console.log("will focus", payload);
                  this.onTabPressed();
                }}
              />
              <Header
                placement="left"
                containerStyle={styles.title}
                centerComponent={{ text: 'YOUR LISTINGS', style: { color: '#FFF', fontSize: 25 } }}
              />
              {this.state.addedListings.length == 0 &&
                    <View style={styles.noAddedListing}>
                        <Text style={styles.noAddedListingText}>Your Added Listings Will be Here</Text>
                    </View>
              }
              <ScrollView style={styles.scrollView}>
              {
                  this.state.addedListings.map((item)=>(
                    <MyListing
                      listing={item}
                      handleListingSelect={this.handleListingSelect}>
                    </MyListing>
                  ))
              }
              </ScrollView>
              <ListingPage
              {...this.state.selectedListing}
              visible={this.state.selectedListingModalVisible}
              close={this.handleCloseModal}
              currentUserId = {this.state.userId}
              allowViewProfile = {true}
              />
            </View>
          </ImageBackground>
          );
    }
}

const styles = StyleSheet.create({
    title: {
      backgroundColor: '#8A2BE2'
    },
    noAddedListing: {
        flex: 1,
        marginTop: 50,
        marginBottom: 30,
        justifyContent: 'center',
    },
    noAddedListingText: {
      fontSize: 28,
      textAlign: 'center',
      justifyContent: 'center',
      margin: 15,
      color:'white'
    },
    scrollView: {
      width: '95%',
      margin: '2.5%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
      color:'black',
      fontSize:15,
    },
});
