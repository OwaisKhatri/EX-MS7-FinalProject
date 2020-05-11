import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import { getToken, onMessageReceived } from './src/Config/Firebase/Messaging'

import { loginStack } from './src/Stack/Login'
import { mainStack } from './src/Stack/Home'
import { usersCollection, storeUserKey, onRegisterPage } from './src/Utilities/Constants'
import { showLoader } from './src/Utilities/Loader'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      user: null
    }
    this.setLoading = this.setLoading.bind(this)
  }

  setLoading(isLoading) {
    this.setState({
      isLoading
    })
  }

  async componentDidMount() {
    try {
      auth().onAuthStateChanged(async (user) => {
        const onRegister = await AsyncStorage.getItem(onRegisterPage)
        await getToken()
        this.setLoading(true)
        console.log(`App.js onAuthState: ${JSON.stringify(user, null, 2)}`)
        if (user) {
          const userData = await firestore()
            .collection(usersCollection)
            .where('id', '==', user.uid)
            .limit(1)
            .get()
          userData.forEach(async (user) => {
            await AsyncStorage.setItem(storeUserKey, JSON.stringify(user.data()))
          })
          if (onRegister === "false") {
            this.setState({
              user
            })
          }
          this.setLoading(false)
        } else {
          this.setState({
            user: null
          })
          this.setLoading(false)
        }
      })
    } catch (error) {
      console.log(`App.js authError: ${JSON.stringify(error, null, 2)}`)
    }
    onMessageReceived()
  }

  render() {
    const Stack = createStackNavigator();
    const { isLoading, user } = this.state
    return (
      <>
        <StatusBar backgroundColor="#B7C6E8" />
        <NavigationContainer>
          {/* {loginStack()} */}
          {!user ?
            loginStack() :
            mainStack()
          }

        </NavigationContainer>
        {showLoader(isLoading)}
      </>
    );
  }
  componentWillUnmount() {
    this.setState({
      user: null
    })
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.lighter,
  },
});

export default App;
