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
    flex:1,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 150/2,
  },
})

export default SearchFilterButton;
