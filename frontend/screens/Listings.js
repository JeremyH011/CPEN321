import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { Header } from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';

import tabBarIcon from '../components/tabBarIcon';
import Listing from '../classes/Listing';
import { AsyncStorage } from 'react-native';
import { DB_URL } from '../key';
import ListingPage from '../components/ListingPage';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Listings extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-list-box'),
        title: "Your Listings"
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
        fetch(DB_URL+`get_listings_by_usedId/`, {
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
              console.error(error);
            });
      }

    render() {
        return (
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
                  <TouchableOpacity onPress={() => this.handleListingSelect(item, true)}>
                      <Text style={styles.boxItem}>
                        Title: {item.title}{"\n"}
                        $/month: {item.price}{"\n"}
                        Address: {item.address}{"\n"}
                        </Text>
                  </TouchableOpacity>
                  ))
              }
              </ScrollView>
              <ListingPage
              {...this.state.selectedListing}
              visible={this.state.selectedListingModalVisible}
              close={this.handleCloseModal}
              />
            </View>
          );
    }
}

const styles = StyleSheet.create({
    title: {
      backgroundColor: '#8A2BE2'
    },
    noAddedListing: {
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
    },
    noAddedListingText: {
      fontSize: 28,
      textAlign: 'center',
      justifyContent: 'center',
      margin: 15
    },
    scrollView: {
      margin:'5%',
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
    boxItem:{
      fontSize: 20,
      margin: '5%',
    }
});
