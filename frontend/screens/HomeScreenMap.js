/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from '@react-native-community/geolocation';
import FetchLocation from '../components/FetchLocation';
import UsersMap from '../components/UsersMap'
import AddListing from '../components/AddListing';
import tabBarIcon from '../components/tabBarIcon';

export default class HomeScreenMap extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('md-map'),
  };

  state = {
    userLocation: null,
    modalVisible: false
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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

  addListingHandler = () => {
    this.setModalVisible(true);
  }

  render () {
    return (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.container}>
              <FetchLocation onGetLocation={this.getUserLocationHandler} />
              <UsersMap userLocation={this.state.userLocation}/>
              <AddListing onAddListing={this.addListingHandler}/>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setModalVisible(false); } }>
                <View style={styles.modal}>
                    <TextInput style={styles.modalTextInput} placeholder="Name"/>
                    <TextInput style={styles.modalTextInput} placeholder="Address"/>
                    <TouchableOpacity style={styles.modalButton}>
                        <Text>Add Listing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => { this.setModalVisible(false); } }>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
              </Modal>
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
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  modalButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    padding: 10,
  }
});
