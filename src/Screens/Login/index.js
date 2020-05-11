import React, { Component } from 'react';
import { StatusBar, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';


import CustomTouchableOpacity from '../../Components/CustomTouableOpacity';
import { showLoader } from '../../Utilities/Loader'
import { usersCollection, onRegisterPage } from '../../Utilities/Constants'

export default class Login extends Component {

  async componentDidMount() {
    await AsyncStorage.setItem(onRegisterPage, "false");
  }

  async buttonClick(id) {
    if (id === 'email') {
      const { navigation } = this.props
      navigation.navigate('Login with Email')
    } else if (id === 'facebook') {
      await this.facebookLogin()
    }
  }

  async facebookLogin() {
    showLoader(true)
    console.log('facebooklogin')
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      showLoader(false)
      throw alert('User cancelled login')
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      showLoader(false)
      throw alert('Something went wrong obtaining access token')
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    try {
      const userResult = await auth().signInWithCredential(facebookCredential)
      const userData = {
        displayName: userResult.user.displayName,
        photoURL: userResult.user.photoURL,
        phoneNumber: userResult.user.phoneNumber,
        email: userResult.user.email,
        id: userResult.user.uid
      }
      await firestore().collection(usersCollection).doc(userData.id).set(userData)
      showLoader(false)
    } catch (e) {
      showLoader(false)
      alert(e.message)
    }

  }
  logout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.upperContainer}>
          <Text style={styles.textStyle}>Track Buddy</Text>
          <Image source={require('../../assets/logo/splash_logo.png')} style={{ width: 250, height: 250 }} />
        </View>

        <View style={styles.buttonContainer}>
          <CustomTouchableOpacity
            icon="mail"
            showIcon={true}
            text="Continue with email/password"
            onPress={() => this.buttonClick('email')} />

          <CustomTouchableOpacity
            icon="logo-facebook"
            showIcon={true}
            text="Continue with facebook"
            onPress={() => this.buttonClick('facebook')} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#d5dff5',
    alignItems: 'center',
    paddingTop: 30
  },
  upperContainer: {
    flex: 2,
    alignItems: 'center',
  },
  textStyle: {
    color: '#5285F6',
    fontSize: 35
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center"
  }
});
