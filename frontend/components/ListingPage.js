import React from 'react'
import {Modal, Text} from 'react-native';

export default class ListingPage extends React.Component {

  render() {
      return (
        <Modal
          visible= {this.props.visible}
          onRequestClose= {this.props.close}
        >
          <Text>Title : {this.props.title}</Text>
          <Text>Address : {this.props.address}</Text>
          <Text>Price : {this.props.price}</Text>
          <Text>Beds : {this.props.numBeds}</Text>
          <Text>Baths : {this.props.numBaths}</Text>
          <Text>Maps URL : {this.props.mapsUrl}</Text>
        </Modal>
      );
  }
}
