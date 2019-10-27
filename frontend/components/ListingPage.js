import React from 'react'
import {Modal,
        Text,
        View,
        Dimensions,
        StyleSheet,
        ScrollView,
        Image} from 'react-native';
import {DB_URL} from '../key';
import Carousel from 'react-native-snap-carousel';

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

  render() {
      const item = this.props.photos;
      if(item != null){
        console.log(item);
      }
      return (
        <Modal
          visible= {this.props.visible}
          onRequestClose= {this.props.close}
          style={styles.modal}
        >
          <View style={styles.gallery}>
            {item && (<Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={Array.from(item)}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                />
            )}
          </View>
          <View style={styles.text_box}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.text}>Title : {this.props.title}</Text>
              <Text style={styles.text}>Address : {this.props.address}</Text>
              <Text style={styles.text}>Price : {this.props.price}</Text>
              <Text style={styles.text}>Beds : {this.props.numBeds}</Text>
              <Text style={styles.text}>Baths : {this.props.numBaths}</Text>
              <Text style={styles.text}>Maps URL : {this.props.mapsUrl}</Text>
            </ScrollView>
          </View>
        </Modal>
      );
  }
}

const styles = StyleSheet.create({
    modal: {
      flex: 1,
    },
    gallery: {
      flex: 4,
    },
    text_box: {
      marginTop: 10,
      padding: 10,
      flex: 6,
    },
    text: {
      fontSize: 20,
    }
});
