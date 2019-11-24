import React from 'react'
import {View,
    StyleSheet,
    Text,
    Modal,
    TextInput,
    Button,
    ScrollView,
    ActivityIndicator,} from 'react-native';
import { API_KEY, DB_URL } from '../key';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import FilterSlider from './FilterSlider';
import FilterSliderOneVal from './FilterSliderOneVal';

export default class SearchFilterPage extends React.Component {
    state = {
        modalVisible: false,
        bedRange: [0,5],
        bathRange: [0,5],
        priceRange: [0,5000],
        poiRange: [20],
        addressField: '',
        latitude: null,
        longitude: null,
        scrollViewVisible: true,
    }

    resetState = () => {
        this.setState({
            bedRange: [0,5],
            bathRange: [0,5],
            priceRange: [0,5000],
            poiRange: [20],
            addressField: '',
            latitude: null,
            longitude: null,
        });
    }

    handleSearch() {
        this.saveSearchHistory();
        this.setModalVisible(false);
      }

    saveSearchHistory = () => {
        return fetch(DB_URL+'save_search_history/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bedMin: this.state.bedRange[0],
                bedMax: this.state.bedRange[1],
                bathMin: this.state.bathRange[0],
                bathMax: this.state.bathRange[1],
                priceMin: this.state.priceRange[0],
                priceMax: this.state.priceRange[1],
                poiRangeMax: this.state.poiRange[0],
                address: this.state.addressField,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                userId: this.props.userId,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            alert("Found " + responseJson.numResults+ " results");
            if(responseJson.numResults > 0)
            {
                this.getListingsByFilter();
                this.props.centerMapWithDelta(responseJson.latitude, responseJson.longitude, 
                                                responseJson.latitudeDelta, responseJson.longitudeDelta);
            }
            else
            {
                this.resetState();
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    getListingsByFilter = () => {
        return fetch(DB_URL+'get_listings_by_filter/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bedMin: this.state.bedRange[0],
                bedMax: this.state.bedRange[1],
                bathMin: this.state.bathRange[0],
                bathMax: this.state.bathRange[1],
                priceMin: this.state.priceRange[0],
                priceMax: this.state.priceRange[1],
                poiRangeMax: this.state.poiRange[0],
                address: this.state.addressField,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
        this.props.populateListingLocations(responseJson);
        this.resetState();
        })
        .catch((error) => {
        alert(error);
        });
    }

    priceSliderChange = values => {
        this.setState({
            priceRange: values,
        });
    };

    bedSliderChange = values => {
        this.setState({
            bedRange: values,
        });
    };

    bathSliderChange = values => {
        this.setState({
            bathRange: values,
        });
    };

    poiDistSliderChange = value => {
        this.setState({
            poiRange: value,
        });
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    setNewListingAddress = addressObject => {
        this.setState({addressField: addressObject.formatted_address,
                        latitude: addressObject.lat,
                        longitude: addressObject.lng,
                        scrollViewVisible: true});
    }

    handleAddressChange(address, handleTextChange) {
        handleTextChange(address);
        this.setState({addressField: address, scrollViewVisible: true});
    }

    render() {
        return (
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false); } }>
                <View style={styles.title}>
                    <Text style={styles.textTitle}>Narrow your Search</Text>
                </View>      
                <FilterSlider
                    minRangeVal={0}
                    maxRangeVal={5000}
                    step={100}
                    endRangeMarker={'5000+'}
                    startText={'Between: '}
                    middleText={'$/month and '}
                    endText={ ' $/month'}
                    length={280}
                    changeParentSliderState={this.priceSliderChange}/>    
                <View style={styles.sliderRow}>
                    <FilterSlider
                        minRangeVal={0}
                        maxRangeVal={5}
                        step={1}
                        endRangeMarker={'5+'}
                        startText={'Between: '}
                        middleText={' & '}
                        endText={ ' Beds'}
                        length={130}
                        changeParentSliderState={this.bedSliderChange}/>  
                    <FilterSlider
                        minRangeVal={0}
                        maxRangeVal={5}
                        step={1}
                        endRangeMarker={'5+'}
                        startText={'Between: '}
                        middleText={' & '}
                        endText={ ' Baths'}
                        length={130}
                        changeParentSliderState={this.bathSliderChange}/>  
                </View>  
                <FilterSliderOneVal
                    minRangeVal={1}
                    maxRangeVal={20}
                    step={1}
                    endRangeMarker={'20+'}
                    startText={'Within: '}
                    endText={ 'km of below address'}
                    length={280}
                    changeParentSliderState={this.poiDistSliderChange}/>  
                <View style={styles.modal}>
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
                </View>
                <Button title='Search' color='#BA55D3' style={styles.modalButton} onPress={() => { this.handleSearch()}}/>
                <Button title='Cancel' color='#8A2BE2' style={styles.modalButton} onPress={() => { this.setModalVisible(false); } }/>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
      marginTop: 0,
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
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
    title: {
      flex: 1,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: 35,
      backgroundColor: '#8A2BE2'
    },
    textTitle: {
        fontSize:15,
        color:'white'
    },
    scrollView: {
      flex: 1,
      height: 250,
      width: 300,
    },
    sliderRow: {
        flexDirection: 'row',
        marginLeft: 57,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
