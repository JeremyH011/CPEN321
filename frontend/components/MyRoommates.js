import React, {PureComponent} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class MyRoommates extends PureComponent {
    _handlePress = (userId, displayModal) => {
        this.props.handleUserSelect(userId, displayModal);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this._handlePress(this.props.user.userId, true)}>
              <Text style={styles.boxItem}>
                Name: {this.props.user.name}{"\n"}
                Email: {this.props.user.email}
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

export default MyRoommates;
