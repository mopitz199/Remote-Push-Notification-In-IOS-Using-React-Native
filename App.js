/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

import firebase from 'react-native-firebase';

var PushNotification = require('react-native-push-notification');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  onPress = () => {
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Notify" onPress={this.onPress} />
      </View>
    );
  }
}

const messaging = firebase.messaging();

messaging.hasPermission()
  .then((enabled) => {
      if (enabled) {
          messaging.getToken()
              .then(token => { console.log(token) })
              .catch(error => { /* handle error */ });
      } else {
          messaging.requestPermission()
              .then(() => { /* got permission */ })
              .catch(error => { /* handle error */ });
      }
  })
  .catch(error => { /* handle error */ });

firebase.notifications().onNotification((notification) => {
  const { title, body } = notification;
  PushNotification.localNotification({
    title: title,
    message: body, // (required)
  });
});


PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
      console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      //notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  //senderID: "YOUR GCM (OR FCM) SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
