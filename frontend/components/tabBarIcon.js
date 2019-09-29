import React from 'react';
import MaterialIcons from 'react-native-vector-icons/Ionicons';

const tabBarIcon = name => ({tintColor}) => (
    <MaterialIcons
        style={{ backgroundColor: 'transparent'}}
        name={name}
        color={tintColor}
        size={24}
    />
);

export default tabBarIcon;