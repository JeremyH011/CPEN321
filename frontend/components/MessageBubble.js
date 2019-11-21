import React, {PureComponent} from 'react';
import { View, Text, StyleSheet } from 'react-native';

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends PureComponent {
    render() {
  
      //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
      var leftSpacer = this.props.direction === 'left' ? null : <View style={{width: 70}}/>;
      var rightSpacer = this.props.direction === 'left' ? <View style={{width: 70}}/> : null;
  
      var bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
  
      var bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;
  
      return (
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              {leftSpacer}
              <View style={bubbleStyles}>
                <Text style={bubbleTextStyle}>
                  {this.props.text}
                </Text>
              </View>
              {rightSpacer}
            </View>
        );
    }
  }

  export default MessageBubble;

  const styles = StyleSheet.create({
  
    //MessageBubble
  
    messageBubble: {
        borderRadius: 5,
        marginTop: 8,
        marginRight: 10,
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection:'row',
        flex: 1
    },
  
    messageBubbleLeft: {
      backgroundColor: '#DDA0DD',
    },
  
    messageBubbleTextLeft: {
      color: 'black'
    },
  
    messageBubbleRight: {
      backgroundColor: '#9932CC'
    },
  
    messageBubbleTextRight: {
      color: 'white'
    },
  })