import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class MyListing extends PureComponent {
    _handlePress = (listing, displayModal) => {
        this.props.handleListingSelect(listing, displayModal);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this._handlePress(this.props.listing, true)}>
                <Text style={styles.boxItem}>
                    {this.props.listing.title}{"\n"}
                    $/month: {this.props.listing.price}{"\n"}
                    Address: {this.props.listing.address}{"\n"}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    boxItem:{
        fontSize: 20,
        margin: '5%',
      }
})

export default MyListing;
