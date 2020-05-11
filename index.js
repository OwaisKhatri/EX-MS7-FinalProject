/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'
import { Notifications } from 'react-native-notifications'

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    Notifications.postLocalNotification({
        body: 'Local notification!',
        title: 'Local Notification Title',
        sound: 'chime.aiff',
        category: 'SOME_CATEGORY',
        link: 'localNotificationLink'
      });
  });

AppRegistry.registerComponent(appName, () => App);
