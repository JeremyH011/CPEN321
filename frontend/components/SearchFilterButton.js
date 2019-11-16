import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const SearchFilterButton = props => (
  <FAB
    testID={props.testID}
    style={styles.fab}
    icon="search"
    onPress={props.onSearchFilterClicked}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 12,
    left: 0,
    bottom: 30,
  },
})

export default SearchFilterButton;
