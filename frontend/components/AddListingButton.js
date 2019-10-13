import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const AddListingButton = props => (
  <FAB
    style={styles.fab}
    small
    icon="add"
    onPress={props.onAddListing}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
  },
})

export default AddListingButton;
