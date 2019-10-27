import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

class ListingMarker extends PureComponent {

    tap = () => {
      this.props.showInfo(this.props.listing, this.props.listing.tapped);
      if (this.props.listing.tapped) {
        this.props.listing.tapped = false;
      } else {
        this.props.listing.tapped = true;
      }
    }

    render() {
        let coordinates = {latitude: 0, longitude: 0};
        if(this.props.listing.latitude != null && this.props.listing.longitude != null){
          coordinates = {latitude: this.props.listing.latitude, longitude: this.props.listing.longitude};
          return (
            <MapView.Marker
                coordinate={coordinates}
                title={this.props.listing.title + ", $" + this.props.listing.price + "/month"}
                onPress={this.tap}
             />
          );
        }
        else{
          return(
            <View/>
          );
        }
    }
}

export default ListingMarker;
