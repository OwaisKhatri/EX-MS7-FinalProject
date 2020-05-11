import React, { Component } from 'react';
import { TextInput, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import CustomTextInput from '../../Components/CustomTextInput'
import CustomTouchableOpacity from '../../Components/CustomTouableOpacity'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { emailId, passwordId, invalidEmail, userDisabled, noUser, invalidPassword } from '../../Utilities/Constants'
import { showLoader } from '../../Utilities/Loader'
import { isEmailValid } from '../../Utilities/Utils';

export default class LoginWithEmail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            email: '',
            password: ''
        }

        this.onLogin = this.onLogin.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    goToRegister() {
        const { navigation } = this.props
        navigation.push("Create Account")
    }
    changeText(text, id) {
        this.setState({
            [id]: text
        })
    }
    textInput(placeholderText, returnKey, maxLength, secureType, id, keyboardType, value) {
        return (<CustomTextInput
            placeholderTextColor="#5285F6"
            placeholder={placeholderText}
            keyboardType={keyboardType}
            secureTextEntry={secureType}
            returnKeyType={returnKey}
            maxLength={maxLength}
            onChangeText={(text) => this.changeText(text, id)}
            value={value} />
        )
    }
    setLoading(isLoading) {
        this.setState({
            isLoading
        })
    }
    async onLogin() {
        this.setLoading(true)
        const { email, password } = this.state
        if (email === '') {
            this.setLoading(false)
            alert('Email is missing')
        } else if (!isEmailValid(email)) {
            this.setLoading(false)
            alert('Invalid Email')
        } else if (password === '') {
            this.setLoading(false)
            alert('Password is missing')
        } else {
            try {
                const authResult = await auth().signInWithEmailAndPassword(email, password)
                // console.log(`UID: ${authResult.user.uid}`)
                this.setState({
                    email: '',
                    password: ''
                })
                this.setLoading(false)
            } catch (error) {
                this.setLoading(false)
                console.log(error)
                switch (error.code) {
                    case 'auth/invalid-email': {
                        alert(invalidEmail)
                        break;
                    }
                    case 'auth/user-disabled': {
                        alert(userDisabled)
                        break
                    }
                    case 'auth/user-not-found': {
                        alert(noUser)
                        break
                    }
                    case 'auth/wrong-password': {
                        alert(invalidPassword)
                        break
                    }
                    default: {
                        alert('Something went wrong... Try again later.')
                        break
                    }
                }
            }
        }

    }
    render() {
        const { isLoading, email, password } = this.state
        return (
            <View style={styles.mainContainer}>
                <View style={styles.upperContainer}>
                    <Text style={styles.textStyle}>Track Buddy</Text>
                    <Image source={require('../../assets/logo/splash_logo.png')} style={{ width: 200, height: 200 }} />
                </View>

                <View style={styles.inputContainer}>

                    {this.textInput("Email", "next", 40, false, emailId, "email-address", email)}
                    {this.textInput("Password", "done", 15, true, passwordId, null, password)}

                    <View style={{ marginTop: 50, alignSelf: "center" }}>
                        <CustomTouchableOpacity
                            touchableViewStyle={styles.touchableView}
                            text="Login"
                            showIcon={false}
                            onPress={this.onLogin.bind(this)} />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15
                    }}>
                        <Text style={{ color: '#5285F6' }}>Not Registered? </Text>
                        <TouchableOpacity onPress={this.goToRegister.bind(this)}>
                            <Text style={{
                                textDecorationLine: "underline",
                                fontWeight: 'bold',
                                color: '#5285F6'
                            }}>
                                Click here to register
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {showLoader(isLoading)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#d5dff5'
    },
    upperContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    inputContainer: {
        flex: 2,
        marginTop: 50
    },
    textStyle: {
        color: '#5285F6',
        fontSize: 35
    },
    touchableView: {
        width: 150,
        backgroundColor: '#799FF4',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        paddingStart: 25,
        paddingEnd: 25
    },
    registerView: {
        alignItems: "center",
        paddingTop: 20
    }
});
