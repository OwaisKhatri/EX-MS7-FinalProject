import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Button, StyleSheet, View, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import { Icon } from 'native-base';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'
import GeoLocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import AsyncStorage from '@react-native-community/async-storage';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import CustomToucableOpacity from '../../Components/CustomTouableOpacity';
import { usersCollection, storeUserKey, selectedGroup } from '../../Utilities/Constants';


class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0,
        longitudeDelta: 0.0,
      },
      user: '',
      selectedGroup: '',
      allUsers: [],
      allUsersLatLng: []
    }
  }

  getUserLocation() {
    GeoLocation.getCurrentPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0,
        }
      })
    },
      error => {
        console.log(`Location Error: ${JSON.stringify(error, null, 2)}`)
        if (error.code === 2) {
          Alert.alert(
            'Location Error',
            `Please turn on your location to proceed`,
            [
              {
                text: 'TURN ON', onPress: () =>
                  Platform.OS === "android" &&
                  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                    .then(data => {
                      // this.getUserLocation()
                    }).catch(err => {
                      alert('Something went wrong with Location')
                    })
              },
            ],
            { cancelable: false },
          );
        } else {
          alert(error.message)
        }
      })
  }
  userLocationChange(event) {
    this.setState({
      region: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.01255,
        longitudeDelta: 0.01255,
      }
    })
  }

  async componentDidMount() {
    this.getUserLocation()

    const userData = await AsyncStorage.getItem(storeUserKey)
    const user = JSON.parse(userData)
    this.setState({
      user
    })

    await this.getSelectedGroup()
    await this.getAllUsers()

    const { navigation } = this.props
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          {/* <TouchableWithoutFeedback onPress={() => this.inviteUser()}>
            <Icon name="adduser" type="AntDesign" style={{ color: '#5285F6', marginEnd: 15 }} />
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback onPress={() => this.logout()}>
            <Icon name="logout" type="AntDesign" style={{ color: '#5285F6', marginEnd: 15 }} />
          </TouchableWithoutFeedback>
        </View>
      ),
    });

    this._unsubscribe()

    setInterval(() => {
      firestore().collection(usersCollection).doc(user.id).update({
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude
      })
    }, 30000)
  }

  _unsubscribe() {
    const { navigation } = this.props
    navigation.addListener('focus', async () => {
      await this.getSelectedGroup()
      await this.getAllUsers()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getSelectedGroup() {
    const selectedGroupData = await AsyncStorage.getItem(selectedGroup)
    const group = JSON.parse(selectedGroupData)
    this.setState({
      selectedGroup: group
    })
  }

  async getAllUsers() {
    const { allUsers, selectedGroup, allUsersLatLng, user } = this.state

    const allUsersFirebase = await firestore()
      .collection(usersCollection)
      .get()

    allUsersFirebase.forEach(userFirebase => {
      if (selectedGroup !== null) {
        selectedGroup.members.forEach(member => {
          if (userFirebase.data().id === member.userId) {
            if (userFirebase.data().id !== user.id) {
              allUsersLatLng.push({
                latitude: userFirebase.data().latitude,
                longitude: userFirebase.data().longitude
              })
            }
          }
        })
      }
    })
    this.setState({
      allUsersLatLng
    })
  }

  inviteUser() {
    console.log('invite user')
  }

  async logout() {
    try {
      await auth().signOut()
      await AsyncStorage.removeItem(storeUserKey)
      await AsyncStorage.removeItem(selectedGroup)
      console.log('User signed out!')
    } catch (error) {
      alert('Something went wrong... Try again later.')
    }
  }
  render() {
    const { region, user, selectedGroup, allUsersLatLng } = this.state
    return (
      <View style={styles.mainContainer}>
        <MapView
          region={region}
          style={styles.mapStyle}
          showsMyLocationButton={true}
          showsUserLocation={true}
          onUserLocationChange={e => this.userLocationChange(e)}
        >

          {allUsersLatLng.map((userLatLng, index) => {
            return <Marker
              key={index}
              coordinate={{
                latitude: userLatLng.latitude,
                longitude: userLatLng.longitude
              }}
              title="Location"
            />
          })}
        </MapView>
        <Button
          title="I am in Danger"
          color="red" />

        {selectedGroup == null &&
          <Button
            title="No Group Selected. Go to Groups"
            color="#799FF4"
            onPress={() => {
              const { navigation } = this.props
              navigation.navigate("Groups")
            }} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#d5dff5',
  },
  mapStyle: {
    flex: 9
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
});

export default Home;
