import React, {PureComponent} from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import AutogrowInput from 'react-native-autogrow-input';

//The bar at the bottom with a textbox and a send button.
class InputBar extends PureComponent {

    //AutogrowInput doesn't change its size when the text is changed from the outside.
    //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
    //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
    //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
    //of the InputBar's text to be set from the outside.
    componentWillReceiveProps(nextProps) {
      if(nextProps.text === '') {
        this.autogrowInput.resetInputText();
      }
    }
   //onContentSizeChange={this.props.onSizeChange}
    render() {
      return (
            <View style={styles.inputBar}>
              <AutogrowInput style={styles.textBox}
                          ref={(ref) => { this.autogrowInput = ref }} 
                          multiline={true}
                          defaultHeight={30}
                          onChangeText={(text) => this.props.onChangeText(text)}
                          placeholder="Enter Message"
                          value={this.props.text}/>
              <TouchableHighlight style={styles.sendButton} onPress={() => this.props.onSendPressed()}>
                  <Text style={{color: 'white'}}>Send</Text>
              </TouchableHighlight>
            </View> 
            );
    }
  }

  const styles = StyleSheet.create({
    inputBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
      paddingVertical: 3,
    },
  
    textBox: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'gray',
      flex: 1,
      fontSize: 16,
      minHeight: 50,
      paddingHorizontal: 10
    },
  
    sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 15,
      marginLeft: 5,
      paddingRight: 15,
      borderRadius: 5,
      backgroundColor: '#8A2BE2'
    },
  })

  export default InputBar;