import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const AddListingButton = props => (
  <FAB
    testID={props.testID}
    style={styles.fab}
    icon="add"
    onPress={props.onAddListing}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 12,
    right: 0,
    bottom: 30,
  },
})

export default AddListingButton;
