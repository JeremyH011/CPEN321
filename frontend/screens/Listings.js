import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';

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

    componentDidMount(){
        this.setUserId();
        this.getAddedListings();
    }

    async setUserId(){
        this.setState({userId: await AsyncStorage.getItem('userId')});
    }

    getAddedListings(){
        fetch(DB_URL+`get_listings_by_usedId?userId=${this.state.userId}`, {
            method: "GET",
          }).then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                addedListings: responseJson.map((listingJson) => new Listing(listingJson))
              });
              console.log(this.state.addedListings);
            })
            .catch((error) => {
              console.error(error);
            });
      }

    render() {
        return (
            <View>
              <View style={styles.title}>
                <Text style={styles.textTitle}>Listings</Text>
              </View>
              {this.state.addedListings.length == 0 && 
                    <View style={styles.noAddedListing}>
                        <Text style={styles.noAddedListingText}>Your Added Listings Will be Here</Text>
                    </View>
              }
              
              {this.state.addedListings.length > 0 &&
                    <View style={styles.modal}>
                            <Text>Your Added Listings</Text>
                            <ScrollView style={styles.scrollView}>
                            {
                                this.state.recommended.map((item)=>(
                                <Text style={styles.boxItem} key={item.email}>
                                    Title: {item.titlee}{"\n"}
                                    $/month: {item.price}{"\n"}
                                    Address: {item.address}{"\n"}
                                </Text>
                                ))
                            }
                            </ScrollView>
                    </View>
              }
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
        borderWidth: 1,
    },
    noAddedListingText: {
      fontSize: 28,
      textAlign: 'center',
    },
    modal: {
      flex: 1,
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
      borderWidth: 1,
    }
});
