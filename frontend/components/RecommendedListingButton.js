import * as React from 'react';
import { StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

const RecommendedListingButton = props => (
  <Button
    style={styles.fab}
    labelStyle={styles.text}
    icon="check"
    onPress={props.onRecommended}
    mode="contained"
    color='rgb(3, 218, 196)'
  >
    <Text
      style={styles.text}
    >
      Get Recommended!
    </Text>
  </Button>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: '22.5%',
    bottom: 20,
    maxHeight: 50,
    fontSize: 8,
    borderRadius: 150 / 2,
  },
  text:{
    color:'rgba(0,0,0,0.5)'
  }
})

export default RecommendedListingButton;
