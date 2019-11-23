import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class ChatPreview extends PureComponent {
    _handlePress = (chatteeName, chatRoomId, chatteeId, displayModal) => {
        this.props.handleChatSelect(chatteeName, chatRoomId, chatteeId, displayModal);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this._handlePress(this.props.chatteeName, this.props.chatRoomId, this.props.chatteeId, true)}>
                <Text style={styles.boxItem}>
                    {this.props.chatteeName}{"\n"}
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

export default ChatPreview;
