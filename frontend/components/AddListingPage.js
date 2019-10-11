import React from 'react'
import {View, 
    StyleSheet,
    Text,
    Modal,
    TextInput,
    TouchableOpacity } from 'react-native';

export default class AddListingPage extends React.Component {
    state = {
        modalVisible: false
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        return (
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false); } }>
            <View style={styles.modal}>
                <TextInput style={styles.modalTextInput} placeholder="Name"/>
                <TextInput style={styles.modalTextInput} placeholder="Address"/>
                <TouchableOpacity style={styles.modalButton}>
                    <Text>Add Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => { this.setModalVisible(false); } }>
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
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
    modalTextInput: {
      height: 40,
      width: 300,
      borderWidth: 1,
      margin: 10,
      padding: 10,
    },
    modalButton: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      margin: 10,
      padding: 10,
    }
});