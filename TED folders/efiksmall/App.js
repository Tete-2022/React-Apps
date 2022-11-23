import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView, Platform, Alert, useColorScheme, AppState, LogBox } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { RootNavigators } from './source/Global/Route/Route';
import { connect } from 'react-redux';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification'
import Globalinclude from './source/Global/Globalinclude';
import { APP_NAME, APP_URL } from './source/Global/Helper/Const';
import DeviceInfo from 'react-native-device-info';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import { Settings } from 'react-native-fbsdk-next'

LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native.',
  "`new NativeEventEmitter()` was called with a non-null",
  "Warning: Can't perform a React state update",
  'EventEmitter.removeListener',
  'Warning: Cannot update a component',
  'mapDispatchToProps()'
])

import Colors from './source/Theme/Colors';
let deviceId = DeviceInfo.getDeviceId();
let scheme = global.theme;

const App = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    Settings.initializeSDK()
  }, [])

  AsyncStorage.getItem("theme").then((value) => {
    if (value !== null && value !== undefined) {
      global.theme = value
      scheme = global.theme
    } else {
      global.theme = ""
      scheme = ""
    }
  });

  AsyncStorage.getItem("Token").then((value) => {
    if (value !== null) {
      global.token_val = value
    } else {
      global.token_val = ""
    }
  });

  AsyncStorage.getItem("UserId").then((value) => {
    if (value !== null) {
      global.user_id_val = value
    } else {
      global.user_id_val = ""
    }
  });

  const getSetting = () =>{
    let headers = {
      'Authorization': 'Bearer ' + global.token_val
    }
    global.global_loader_ref.show_loader(1);
    fetch(APP_URL + 'setting' ,{
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json()).then((response) => {
        // console.log("MENU STATUS",response.data.app_menu_status)
        if (response.status) {                              
          global.setting_menu = response.data.app_menu_status;
          global.global_loader_ref.show_loader(0);
        } else {
          global.global_loader_ref.show_loader(0);
        }
      }).catch((c) => {
        console.log("SETTING API ERROR",c)
        global.global_loader_ref.show_loader(0);
      }).finally((f) => {
        global.global_loader_ref.show_loader(0);
      })
  
  }

  useEffect(() => {
    // ** initializing ad mob
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log('adapterStatuses : ', adapterStatuses)
      });

    getSetting()
    notificationToken()
    if (Platform.OS === 'ios') {
      // _checkFirebasePermission();
      PushNotificationIOS.addEventListener("notification", (notification) => {
        console.log("PushNotificationIOS", notification.getData());
        if (
          notification.getData() !== undefined &&
          notification.getData() !== null
        ) {
          let data = notification.getData();
          let notificationObj = {};
          notificationObj.data = data;
          global.isNotificationTap = false;
          _handleNotification(notificationObj, "PushNotificationIOS");
        }        
      });
    }
    messaging().onMessage(async remoteMessage => { });
    // firebase messaging
    unsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onBackgroundMessageHandler);
    messaging().onNotificationOpenedApp(notification => {
      if (notification) {
        global.notification = notification;
        _handleNotification(notification, '1');
      }
    });
    messaging()
      .getInitialNotification()
      .then(notification => {
        if (notification) {
          global.notification = notification;
        }
      });
    const onTokenRefreshListener = messaging().onTokenRefresh((fcmToken) => {
      // Process your token as required
      // console.log("====================================");
      // console.log("fcmToken", fcmToken);
      // console.log("====================================");
    });
    return () => {
      onMessageReceived,
        onTokenRefreshListener;
    };
  }, []);

  const onMessageReceived = notification => {
    if (notification) {
      global.notification = notification;
      _handleNotification(notification, '2');
    }
  };

  const notificationToken = async () => {
    await firebase
      .messaging()
      .getToken()
      .then(fcmToken => {        
        global.notification_token = fcmToken;
        // console.log("fcmToken",global.notification_token)
      })
      .then(() => {});
  };

  const onBackgroundMessageHandler = async notification => {
    if (notification) {
      // console.log('onBackgroundMessageHandler', notification);
      global.notification = notification;
      _handleNotification(notification, '3');
    }
  };

  const _handleNotification = (notification, type) => {
    let data = notification.data;
    _showPushNotification(notification);
    // notificationcountApi()
    console.log("coming in  handle notification",notification)
  };
  
  const _checkFirebasePermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      _requestPermission();
    }
    console.log(enabled)
  };

  const _requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {}
  };

  const _showPushNotification = notification => {
    showPushNotification(notification);
  };

  const showPushNotification = notification => {
    console.log(notification)
    const title = notification?.notification?.title;
    const body = notification?.notification?.message;
    // const icon = notification.notification.imagelink;     
    if (Platform.OS === 'android') {
      PushNotification.channelExists('JimuX', exist => {
        if (!exist) {
          PushNotification.createChannel(
            {
              channelId: 'JimuX', // (required)
              channelName: 'JimuX', // (required)
              channelDescription: 'JimuX',
              soundName: 'default',
            },
            created => {
              if (created) {
                _presentNotification(notification);
              }
            },
          );
        } else {
          _presentNotification(notification);
        }
      });
    } else if (Platform.OS === 'ios') {
      let details = {
        id: new Date().getTime().toString(),
        body: body,
        title: title,

        // userInfo: {image: icon},
      };
      if (AppState.currentState === 'active') {
        PushNotificationIOS.addNotificationRequest(details);
      }      
    }
    return Promise.resolve();
  };

  const _presentNotification = notification => {
    const title = notification.data.title;
    const body = notification.data.body;
    const icon = notification.data.imagelink;

    let largeIcon = icon === '' ? null : icon;

    var notificationObj = {
      title: title,
      message: body,
      bigText: body,
      bigPictureUrl: icon,
      vibrate: true,
      vibration: 300,
      onlyAlertOnce: true,
      allowWhileIdle: true,
      invokeApp: true,
      importance: 'max',
      priority: 'max',
      ignoreInForeground: false,
      foreground: true,
      channelId: 'JimuX',
    };

    if (icon !== '') {
      notificationObj.largeIconUrl = icon;
    } else {
      notificationObj.largeIcon = 'ic_launcher';
    }
    PushNotification.presentLocalNotification(notificationObj);
  };

  // const notificationcountApi = () => {
  //   let data = global.user_id_val ? global.user_id_val : deviceId
  //   fetch(APP_URL + 'count_notifications/' + data, {
  //     method: "PUT",
  //   })
  //     .then((response) => response.json()).then((response) => {
  //       console.log("ress counttt", response);
  //       global.notification_count = response.total
  //       dispatch({ type: "APPS.NOTIFICATIONCOUNT" });
  //     })
  // }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={'#7030A0'} barStyle="dark-content" animated={true}/>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {RootNavigators('Splash')}
        <FlashMessage position="top" animated={true} />
        <Globalinclude.Loader ref={ref => (global.global_loader_ref = ref)} />
      </NavigationContainer>
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => ({
  theme: {
    apps: state.apps.theme,
  },
  notificationCount: {
    apps: state.apps.notificationCount,
  },
});
const mapDispatchToProps = (dispatch) => {
  dispatch({ type: "APPS.THEME" });
  dispatch({ type: "APPS.NOTIFICATIONCOUNT" });
  return {
    // dispatching plain actions
    appTheme: dispatch({ type: "APPS.THEME" }),
    appNotificationCount: dispatch({ type: "APPS.NOTIFICATIONCOUNT" })
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

