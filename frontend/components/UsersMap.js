import React, {PureComponent} from 'react'
import {View, StyleSheet, Modal } from 'react-native';
import MapView from 'react-native-maps';
import ListingMarker from '../components/ListingMarker';
import ListingPage from '../components/ListingPage';

export default class UserMap extends PureComponent {

  state = {
      selectedListing: null,
      selectedListingModalVisible: false,
  }

  handleMarkerSelect = (listing, displayModal) => {
    if (this.state.selectedListing) {
      this.state.selectedListing.tapped = false;
    }

    this.setState({selectedListing:listing,
                   selectedListingModalVisible: displayModal});
                   this.props.centerMap(listing.latitude, listing.longitude);
  }

  handleCloseModal = () => {
    this.props.centerMap(this.state.selectedListing.latitude, this.state.selectedListing.longitude);
    this.setState({selectedListingModalVisible: false});
  }

  render() {
    return (
        <View style={styles.mapContainer}>
            <MapView
            initialRegion={{
                latitude: 49.2827,
                longitude: -123.1207,
                latitudeDelta: 0.0622,
                longitudeDelta: 0.0421,
            }}
            region={this.props.userLocation}
            style={styles.map}>
            {this.props.listingLocations.map(element => (
              <ListingMarker
                listing = {element}
                showInfo = {this.handleMarkerSelect}
                />
            ))}
            </MapView>
            <ListingPage
            {...this.state.selectedListing}
            visible={this.state.selectedListingModalVisible}
            close={this.handleCloseModal}
            currentUserId={this.props.userId}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 600
    },
    map: {
        width: '100%',
        height: '100%'
    }
});
