import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
const imagesRef = storage().ref("images")

import CustomTextInput from '../../Components/CustomTextInput'
import CustomTouchableOpacity from '../../Components/CustomTouableOpacity'
import { usersCollection } from '../../Utilities/Constants'

import {
    profileNameId,
    emailId,
    passwordId,
    confirmPasswordId,
    phoneNumberId,
    emailExists,
    invalidEmail,
    weakPassword,
    onRegisterPage,
    storeUserKey
} from '../../Utilities/Constants'
import { isEmailValid, profileImageName } from '../../Utilities/Utils'
import { showLoader } from '../../Utilities/Loader'

import { uploadImageFile } from '../../Config/Firebase'

export default class Registration extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            isImageSelected: false,
            selectedImageUri: '',
            profileName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: ''
        }
        this.setLoading = this.setLoading.bind(this)
    }
    setLoading(isLoading) {
        this.setState({
            isLoading
        })
    }
    alreadyRegistered() {
        const { navigation } = this.props
        navigation.goBack()
    }
    async onRegisterClick() {
        this.setLoading(true)
        const { isImageSelected, selectedImageUri, profileName, email, password, confirmPassword, phoneNumber } = this.state
        if (profileName === '') {
            this.setLoading(false)
            alert('Profile Name is missing')
        } else if (email === '') {
            this.setLoading(false)
            alert('Email is missing')
        } else if (!isEmailValid(email)) {
            this.setLoading(false)
            alert('Invalid Email')
        } else if (password === '') {
            this.setLoading(false)
            alert('Password is missing')
        } else if (confirmPassword === '') {
            this.setLoading(false)
            alert('Password is missing')
        } else if (password !== confirmPassword) {
            this.setLoading(false)
            alert('Password mismatch')
        } else if (phoneNumber === '') {
            this.setLoading(false)
            alert('Password is missing')
        } else {
            let photoURL = null
            try {

                const authResult = await auth().createUserWithEmailAndPassword(email, password)

                if (isImageSelected) {
                    const imageName = profileImageName()
                    await imagesRef.child(imageName).putFile(selectedImageUri)
                    photoURL = await imagesRef.child(imageName).getDownloadURL()
                }
                const userData = {
                    displayName: profileName,
                    email: email,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    id: authResult.user.uid
                }
                await firestore().collection(usersCollection).doc(authResult.user.uid).set(userData)

                this.setLoading(false)
                const { navigation } = this.props
                Alert.alert(
                    'Account Registered',
                    `Congratulations! Let's start Tracking your Buddy...`,
                    [
                        {
                            text: 'OK', onPress: async () => {
                                await AsyncStorage.setItem(onRegisterPage, "false")
                                await AsyncStorage.removeItem(storeUserKey)
                                await auth().signOut()
                                navigation.goBack()
                            }
                        },
                    ],
                    { cancelable: false },
                );
            } catch (error) {
                this.setLoading(false)
                console.log(error.code)
                switch (error.code) {
                    case 'auth/email-already-in-use': {
                        alert(emailExists)
                        break;
                    }
                    case 'auth/invalid-email': {
                        alert(invalidEmail)
                        break
                    }
                    case 'auth/weak-password': {
                        alert(weakPassword)
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
    onImagePress() {
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response.uri)
                this.setState({
                    isImageSelected: true,
                    selectedImageUri: response.uri,
                });
            }
        });
    }
    async componentDidMount() {
        console.log('Registration: ComponentDidMount')
        await AsyncStorage.setItem(onRegisterPage, "true")
    }
    async componentWillUnmount() {
        console.log('Registration: componentWillUnmount')
        await AsyncStorage.setItem(onRegisterPage, "false")
    }
    render() {
        const { isLoading, isImageSelected, selectedImageUri, profileName, email, password, confirmPassword, phoneNumber } = this.state
        const imagePath = isImageSelected ?
            { uri: selectedImageUri } :
            require('../../assets/images/ic_user_placeholder.png')
        return (
            <View style={styles.mainContainer}>
                <ScrollView>
                    <TouchableWithoutFeedback style={styles.upperContainer}
                        onPress={this.onImagePress.bind(this)}>
                        <Image
                            source={imagePath}
                            style={{
                                width: 85,
                                height: 85,
                                borderRadius: 85 / 2,
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: 'white'
                            }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.inputContainer}>

                        {this.textInput("Profile Name", "next", 40, false, profileNameId, "default", profileName)}
                        {this.textInput("Email", "next", 40, false, emailId, "email-address", email)}
                        {this.textInput("Password", "next", 15, true, passwordId, null, password)}
                        {this.textInput("Confirm Password", "next", 15, true, confirmPasswordId, null, confirmPassword)}
                        {this.textInput("03XXXXXXXXX", "done", 11, false, phoneNumberId, "numeric", phoneNumber)}

                        <View style={{ marginTop: 50, alignSelf: "center" }}>
                            <CustomTouchableOpacity
                                touchableViewStyle={styles.touchableView}
                                text="Register"
                                showIcon={false}
                                onPress={this.onRegisterClick.bind(this)} />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 15
                        }}>
                            <Text style={{ color: '#5285F6' }}>Already Registered? </Text>
                            <TouchableOpacity onPress={this.alreadyRegistered.bind(this)}>
                                <Text style={{
                                    textDecorationLine: "underline",
                                    fontWeight: 'bold',
                                    color: '#5285F6'
                                }}>
                                    Login Here
                            </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {showLoader(isLoading)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#d5dff5',
        paddingBottom: 20
    },
    upperContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10
    },
    inputContainer: {
        flex: 2,
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
        paddingStart: 17,
        paddingEnd: 25
    },
    registerView: {
        alignItems: "center",
        paddingTop: 20
    }
});
