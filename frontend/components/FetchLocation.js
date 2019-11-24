import React from 'react'
import { Button } from 'react-native';

const fetchLocation = props => {
    return (
        <Button color='#BA55D3' title="Get Current Location" onPress={props.onGetLocation} />
    );
};

export default fetchLocation;