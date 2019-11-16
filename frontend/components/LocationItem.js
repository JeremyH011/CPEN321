import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class LocationItem extends PureComponent {
    state = {
        addressObject: null
    }
    _handlePress = async () => {
        const res = await this.props.fetchDetails(this.props.place_id);
        this.setState({
            addressObject: {
              formatted_address: res.formatted_address,
              lat: res.geometry.location.lat,
              lng: res.geometry.location.lng,
              maps_url: res.url
            }
        });
        this.props.setNewListingAddress(this.state.addressObject);
        this.props.clearSearchs();
    }

    render() {
        return (
          <TouchableOpacity testID={this.props.testID} style={styles.root} onPress={this._handlePress}>
            <Text>{this.props.description}</Text>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center'
    }
})

export default LocationItem;
