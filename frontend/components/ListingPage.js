import React from 'react'
import {Modal,
        Text,
        View,
        Dimensions,
        StyleSheet,
        ScrollView,
        Image,
        Linking,
        Button,
        ImageBackground} from 'react-native';
import {DB_URL} from '../key';
import Carousel, {Pagination } from 'react-native-snap-carousel';
import ViewUserPage from "./ViewUserPage";

const {width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class ListingPage extends React.Component {

  _renderItem ({item, index}) {
    const url = { uri: DB_URL + item.path.replace(/\\/g, "/")};
    return (
      <Image source = {url} style = {{height: 300, resizeMode : 'center', margin: 5 }}/>
    );
  }

  get pagination () {
    const {entries, activeSlide} = this.state;
    return (
        <Pagination
          dotsLength={entries.length}
          activeDotIndex={activeSlide}
          dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.92)'
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
  }

  state = {
    userModalVisible: false,
    activeSlide: 0,
    entries: []
  }

  viewProfileHandler = (userId, displayModal) => {
    this.setState({userModalVisible: true});
  }

  handleCloseModal = () => {
    this.setState({userModalVisible: false});
  }

  deleteListing = () => {
    fetch(DB_URL+`delete_listing/`, {
      method: "POST",
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          listingId: this.props.listingId
      }),
    }).then((response) => {
      if(response.status == 200)
      {
        alert("Listing Deleted");
        this.props.close();
      }
    })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
      const item = this.props.photos;
      if(item != null){
        console.log(item);
        this.state.entries = Array.from(this.props.photos);
      }
      return (
        <Modal
          visible= {this.props.visible}
          onRequestClose= {this.props.close}
          style={styles.modal}
        >
          <ImageBackground
            source={require('./background_2.png')}
            style={{width: '100%', height: '100%'}}
          >
            <View style={styles.button_container}>
              {this.props.mapsUrl &&
                <Button style={styles.button} color='#8A2BE2' title='View Listing in Google Maps' onPress = {() => Linking.openURL(this.props.mapsUrl)}></Button>
              }
              {this.props.currentUserId == this.props.userId &&
                <Button style={styles.button} color='#BA55D3' title='Delete' onPress = {() => this.deleteListing()}></Button>
              }
              {(this.props.currentUserId != this.props.userId) && this.props.allowViewProfile &&
                <Button style={styles.button} color='#BA55D3' title="View Landlord's profile" onPress={() => this.viewProfileHandler()}></Button>
              }
            </View>
            <View style={styles.gallery}>
              {item && (<Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={Array.from(item)}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                  />
              )}
              {item && this.pagination}
            </View>
            <View style={styles.text_box}>
              <Text style={styles.h1}>{this.props.title}</Text>
              <Text style={styles.h2}>{this.props.address}</Text>
              <View
                style={{
                  borderBottomWidth: 5,
                  borderColor:'#DDDDDD',
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 20
                }}
              />
              <View style={styles.t1}>
                <Text style={styles.h3_1}>{this.props.numBeds}</Text>
                <Text style={styles.h3_1}>{this.props.numBaths}</Text>
              </View>
              <View style={styles.t1}>
                <Text style={styles.h3_2}>Bed(s)</Text>
                <Text style={styles.h3_2}>Bath(s)</Text>
              </View>
              <Text style={styles.h3_spec}>${this.props.price}/month</Text>
            </View>
            <View style={styles.container}>
              <ViewUserPage ref='viewUserPopup'
                visible={this.state.userModalVisible}
                close={this.handleCloseModal}
                userId={this.props.userId}
                currentUserId={this.props.currentUserId}
                allowChat={true}/>
            </View>
          </ImageBackground>
        </Modal>

      );
  }
}

const styles = StyleSheet.create({
    modal: {
      flex: 1,
    },
    gallery: {
      flex: 6,
    },
    text_box: {
      marginLeft: 10,
      marginRight: 10,
      paddingLeft: 10,
      paddingRight: 10,
      flex: 3,
      //borderColor:'#BA55D3',
      //borderWidth:5,
    },
    container: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
    button_container: {
      marginTop: 10,
      padding: 10,
      flex: 1,
    },
    buttons: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
    },
    h1: {
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      //color: '#8A2BE2'
      color: 'white'
    },
    h2: {
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 15,
      color: 'white'
    },
    t1: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    h3_1:{
      fontSize: 22,
      textAlign: 'center',
      flex: 5,
      //color: '#8A2BE2'
      color: 'white'
    },
    h3_2:{
      fontSize: 22,
      textAlign: 'center',
      flex: 5,
      //color: '#BA55D3'
      color: '#DDDDDD'
    },
    h3_spec:{
      fontSize: 25,
      textAlign: 'center',
      margin: 10,
      fontStyle: 'italic',
      color: 'white'
    },
    text: {
      fontSize: 15,
      flex: 5
    }
});
