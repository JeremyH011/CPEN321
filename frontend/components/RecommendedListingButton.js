import * as React from 'react';
import { StyleSheet, Text} from 'react-native';
import { FAB } from 'react-native-paper';

const RecommendedListingButton = props => (
  <FAB
    testID={props.testID}
    style={styles.fab}
    icon="favorite"
    onPress={props.onRecommended}
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

export default RecommendedListingButton;
