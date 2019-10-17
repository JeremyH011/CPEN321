import React from 'react'
import {View,
    StyleSheet,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator } from 'react-native';
import { API_KEY, DB_URL } from '../key';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { Dropdown } from 'react-native-material-dropdown';
import TextInputMask from 'react-native-text-input-mask';

export default class AddListingPage extends React.Component {
    // @todo: change this so that fields related to listing are
    //        their own obj inside state, rather than remain as
    //        members of state. refer to userLocation inside
    //        HomeScreenMap.js
    state = {
        modalVisible: false,
        scrollViewVisible: false,
        addressField: '',
        title: '',
        latitude: 0.0,
        longitude: 0.0,
        price: 0,
        bed: 0,
        bath: 0,
        maps_url: '',
    }

    setNewListingAddress = addressObject => {
        this.setState({addressField: addressObject.formatted_address,
                        latitude: addressObject.lat,
                        longitude: addressObject.lng,
                        maps_url: addressObject.maps_url,
                        scrollViewVisible: false});
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handleAddressChange(address, handleTextChange) {
        handleTextChange(address);
        this.setState({addressField: address, scrollViewVisible: true});
    }

    handleAddingNewListing() {
      this.createListingInDB();
      this.props.refresh();
      this.props.centerMap(this.state.latitude, this.state.longitude);
      this.setModalVisible(false);
    }

    createListingInDB(){
        fetch(DB_URL+'create_listing/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.state.title,
                address: this.state.addressField,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                price: this.state.price,
                numBeds: this.state.bed,
                numBaths: this.state.bath,
                maps_url: this.state.maps_url,
            }),
        });
    }

    render() {
        return (
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false); } }>
                <View style={styles.modal}>
                    <TextInput
                        style={styles.modalTextInput}
                        placeholder="Title"
                        onChangeText={(text) => this.setState({title: text})}/>
                    <View style={styles.row}>
                        <View style={styles.dropdown}>
                            <Dropdown
                            label='Bed'
                            data={numberOfRooms}
                            onChangeText={(text) => this.setState({bed: parseInt(text)})}
                            />
                        </View>
                        <View style={styles.dropdown}>
                            <Dropdown
                            label='Bath'
                            data={numberOfRooms}
                            onChangeText={(text) => this.setState({bath: parseInt(text)})}
                            />
                        </View>
                        <View>
                            <TextInputMask
                                style={styles.priceTextInput}
                                placeholder="$/month"
                                mask={"$[99990]"}
                                onChangeText={(text) => this.setState({price: parseInt(text.split('$')[1])})}/>
                        </View>
                    </View>
                    <GoogleAutoComplete apiKey={API_KEY} debounce={500} minLength={4} components={"country:ca"}>
                        {({ handleTextChange, locationResults, fetchDetails, isSearching, clearSearchs }) => (
                            <React.Fragment>
                            {this.setState()}
                                <TextInput ref='addressTextInput'
                                    value={this.state.addressField}
                                    style={styles.modalTextInput}
                                    placeholder="Address"
                                    onChangeText={(text) => this.handleAddressChange(text, handleTextChange)}/>
                                {isSearching && <ActivityIndicator/>}

                                { this.state.scrollViewVisible == true &&
                                <ScrollView
                                    style={styles.scrollView}>
                                    {locationResults.map(element => (
                                        <LocationItem
                                        setNewListingAddress={this.setNewListingAddress}
                                        {...element}
                                        key={element.id}
                                        fetchDetails={fetchDetails}
                                        clearSearchs={clearSearchs}
                                        />
                                    ))}
                                </ScrollView>
                                }
                            </React.Fragment>
                        )}
                    </GoogleAutoComplete>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => { this.handleAddingNewListing(); }}>
                        <Text>Add Listing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => { this.setModalVisible(false); } }>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
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
    },
    scrollView: {
      flex: 1,
      height: 250,
      width: 300,
    },
    priceTextInput: {
        marginTop: 30,
        height: 40,
        borderWidth: 1,
        margin: 10,
        padding: 10,
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
    }
});

const numberOfRooms = [
    {value: '0'},
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4'},
    {value: '5'},
    {value: '6'},
    {value: '7'},
    {value: '8'},
    {value: '9'},
    {value: '10'},
  ];
