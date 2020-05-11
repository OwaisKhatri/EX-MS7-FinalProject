import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class CustomToucableOpacity extends Component {

    render() {
        const { touchableViewStyle, icon, showIcon, text, onPress } = this.props
        return (
            <TouchableOpacity style={touchableViewStyle || styles.touchableView} onPress={onPress}>
                <View style={styles.buttonView}>
                    {showIcon &&
                        <Icon name={icon} style={{ color: 'white', marginStart: 15, width: 25, height: 25 }} />
                    }
                    <Text style={styles.textView}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchableView: {
        width: 300,
        backgroundColor: '#799FF4',
        marginTop: 5,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingStart: 10,
        paddingEnd: 10,
    },
    textView: {
        color: 'white',
        marginStart: 20,
        fontSize: 15,
        fontWeight: "bold",
    }
});
