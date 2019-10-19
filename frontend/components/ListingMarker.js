import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

class ListingMarker extends PureComponent {
    render() {
        return (
          <MapView.Marker
              coordinate={{latitude: this.props.listing.latitude,
              longitude: this.props.listing.longitude}}
              title={this.props.listing.title + ", $" + this.props.listing.price + "/month"}
              onPress={()=>this.props.showInfo(this.props.listing)}
           />
        );
    }
}

export default ListingMarker;
