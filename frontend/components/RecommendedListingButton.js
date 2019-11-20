import * as React from 'react';
import { StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

const RecommendedListingButton = props => (
  <Button
    testID={props.testID}
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
      Recommended Roommates!
    </Text>
  </Button>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: '14.5%',
    bottom: 35,
    maxHeight: 100,
    fontSize: 5,
    borderRadius: 150 / 2,
  },
  text:{
    color:'rgba(0,0,0,0.5)'
  }
})

export default RecommendedListingButton;
