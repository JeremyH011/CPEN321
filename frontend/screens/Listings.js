import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import {NavigationEvents} from 'react-navigation';

import tabBarIcon from '../components/tabBarIcon';
import Listing from '../classes/Listing';
import { AsyncStorage } from 'react-native';
import { DB_URL } from '../key';

export default class Listings extends React.Component {
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-list-box'),
    };

    state = {
        userId: null,
        addedListings: []
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
              console.log(this.state.addedListings);
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
              <View style={styles.title}>
                <Text style={styles.textTitle}>Your Listings</Text>
              </View>       
              {this.state.addedListings.length == 0 && 
                    <View style={styles.noAddedListing}>
                        <Text style={styles.noAddedListingText}>Your Added Listings Will be Here</Text>
                    </View>
              }
              <View style={styles.modal}>
                      <ScrollView style={styles.scrollView}>
                      {
                          this.state.addedListings.map((item)=>(
                          <Text style={styles.boxItem}>
                              Title: {item.title}{"\n"}
                              $/month: {item.price}{"\n"}
                              Address: {item.address}{"\n"}
                          </Text>
                          ))
                      }
                      </ScrollView>
              </View>
            </View>
          );
    }
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
    modal: {
      flex: 14,
      alignItems: 'flex-start',
      justifyContent: 'center',
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
    textTitle: {
      fontSize:15,
      color:'white'
    },
    text: {
      color:'black',
      fontSize:15,
    },
    boxItem:{
      fontSize:20,
      margin: '5%',
    }
});
