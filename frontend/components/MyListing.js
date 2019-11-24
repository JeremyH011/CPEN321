import React, {PureComponent} from 'react';
import {View,
        Text,
        StyleSheet,
        TouchableOpacity,
        Image} from 'react-native';
import {DB_URL} from '../key';

class MyListing extends PureComponent {
    _handlePress = (listing, displayModal) => {
        this.props.handleListingSelect(listing, displayModal);
    }

    render() {
        const item = this.props.listing.photos;
        var photo = null;
        if(item != null){
          console.log(item);
          photo = { uri: DB_URL + item[0].path.replace(/\\/g, "/")};
        }
        return (
            <TouchableOpacity style={styles.user_card} onPress={() => this._handlePress(this.props.listing, true)}>
                {photo &&
                  <Image
                    source = {photo}
                    style = {styles.thumbnail}
                  />
                }
                {!photo &&
                  <Image
                    source = {require('./Portrait_Placeholder.png')}
                    style = {styles.thumbnail}
                  />
                }
                <View style={styles.boxItem}>
                  <Text style={styles.internal_text_h1}>{this.props.listing.title}</Text>
                  <Text style={styles.internal_text}>{this.props.listing.address}</Text>
                  <Text style={styles.internal_text}>${this.props.listing.price}/month</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  user_card:{
    borderColor:'#DDDDDD',
    borderWidth: 3,
    borderRadius: 150/2,
    margin: 10,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  boxItem:{
    flex: 6,
    marginTop: 5
  },
  thumbnail:{
    height: 80,
    width: 80,
    borderRadius: 80/2,
    flex: 2,
    margin: 5,
  },
  internal_text_h1:{
    fontSize: 22,
    color: '#8A2BE2',
    marginLeft: 10
  },
  internal_text:{
    fontSize: 13,
    color: '#BA55D3',
    marginLeft: 10
  }
})

export default MyListing;
