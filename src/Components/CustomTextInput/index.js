import React, { Component } from 'react';
import { TextInput, StyleSheet, View, Text, Image } from 'react-native';


export default class CustomTextInput extends Component {

    render() {
        const {
            style,
            placeholderTextColor,
            placeholder,
            keyboardType,
            returnKeyType,
            maxLength,
            secureTextEntry,
            onChangeText,
            value
        } = this.props
        return (

            <TextInput
                style={style || styles.inputStyle}
                placeholderTextColor={placeholderTextColor}
                placeholder={placeholder}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                value={value}
                autoCapitalize="none" />

        );
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        borderColor: '#5285F6',
        borderWidth: 1,
        borderRadius: 5,
        color: '#5285F6',
        marginTop: 25,
        marginStart: 30,
        marginEnd: 30,
        padding: 10,
    }
});
