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
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 150/2,
  },
})

export default AddListingButton;
