import React from 'react'
import {Modal, Text, Image} from 'react-native';

export default class ViewUserPage extends React.Component {

  render() {
      return (
        <Modal
          visible = {this.props.visible}
          onRequestClose = {this.props.close}
          style = {styles.modal}
        >
        <View style={styles.profilePic}>
          <Image source={require('./Portrait_Placeholder.png')} />
        </View>
          <Text>Name : {this.props.name}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => this.props.navigation.navigate("Chat") }>
            <Text>Chat</Text>
          </TouchableOpacity>
        </Modal>
      );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    padding: 10,
  },
  profilePic: {
    width: 300,
    height: 300,
    justifyContent: 'center',
  }
});
