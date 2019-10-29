import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const SearchFilterButton = props => (
  <FAB
    style={styles.fab}
    icon="search"
    onPress={props.onSearchFilterClicked}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 30,
  },
})

export default SearchFilterButton;
