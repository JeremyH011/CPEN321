import React, {PureComponent} from 'react';
import {View,
        Text,
        StyleSheet,
        TouchableOpacity,
        Image} from 'react-native';
import {DB_URL} from '../key';

class MyRoommates extends PureComponent {
    _handlePress = (userId, displayModal) => {
        this.props.handleUserSelect(userId, displayModal);
    }

    render() {
        const item = this.props.user.photo;
        var photo = null;
        if(item != null){
          console.log(item);
          photo = { uri: DB_URL + item[0].path.replace(/\\/g, "/")};
        }
        return (
            <TouchableOpacity style={styles.user_card} onPress={() => this._handlePress(this.props.user.userId, true)}>
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
                <Text style={styles.internal_text}>Name: {this.props.user.name}</Text>
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
      alignItems:'center',
      justifyContent: 'center'
    },
    thumbnail:{
      height: 80,
      width: 80,
      borderRadius: 80/2,
      //resizeMode : 'center',
      flex: 2,
      padding: 20
    },
    internal_text:{
      fontSize: 20,
      color: '#BA55D3'
    }
})

export default MyRoommates;
