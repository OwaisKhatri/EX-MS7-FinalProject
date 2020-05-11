import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications'

async function getToken() {
    const getTokenRes = await messaging().getToken()
    console.log(`TokenRes: ${JSON.stringify(getTokenRes)}`)
}

function onMessageReceived() {
    messaging().onMessage(async remoteMessage => {
        console.log('Foreground - Notification', JSON.stringify(remoteMessage));
        Notifications.postLocalNotification({
            body: 'Local notification!',
            title: 'Local Notification Title',
            sound: 'chime.aiff',
            category: 'SOME_CATEGORY',
            link: 'localNotificationLink',
            fireDate: new Date()
          });
    });
}

export {
    getToken,
    onMessageReceived
}