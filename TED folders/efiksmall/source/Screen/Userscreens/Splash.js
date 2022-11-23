import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, StatusBarIOS, StatusBar, TouchableOpacity, ScrollView, Platform } from 'react-native'
import Global from '../../Global/Globalinclude';
import { Root } from 'native-base'
import AsyncStorage from "@react-native-community/async-storage";
import { RootNavigators } from '../../Global/Route/Route';
import firebase from '@react-native-firebase/app';
import helpers from '../../Global/Helper/Helper';
import { APP_URL } from '../../Global/Helper/Const';
import { scale } from '../../Theme/Scalling'
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import useTrackingTransparency from '../../hooks/useTrackingTransparency';

let deviceId = DeviceInfo.getDeviceId();

const Splash = (props) => {
    global.county_code_val = '+91';
    // global.currency_val = '$';
    const [isShow, setIsShow] = useState(true)

    const { isLoading, setRequestPermission } = useTrackingTransparency()

    const getCurrency = async () => {
        try {
            let headers = {
                "Content-Type": "application/json"
            }
            const apiRes = await fetch(APP_URL + 'setting', {
                method: 'POST',
                headers: headers
            })
            const res = await apiRes.json()
            if (res.status) {
                if (res.data) {
                    global.currency_val = res.data.currency_symbol
                }
            }
        } catch (err) {
            console.log('[getCurrency] Error : ', err.message)
        }
    }

    const notificationredirect = () => {
        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onRegister: function (token) {
            },
            onNotification: function (notification) {

                if (notification.userInteraction) {

                    if (global.notification.data !== undefined)

                        props.navigation.navigate("Notification")
                }
                else {
                    // navigation.navigate("Login")
                }

            },
            // IOS ONLY (optional): default: all - Permissions to register.
            // permissions: {
            //     alert: true,
            //     badge: true,
            //     sound: true,
            // },
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: false,
        });
    }

    const checkPermission = async (id) => {
        if (Platform.OS === 'ios') {
            const enabled = await firebase.messaging().hasPermission();
            if (enabled) {
                await updateToken(id);
            }
        } else {
            await updateToken(id);
        }
    };

    const updateToken = async (id) => {
        try {
            setRequestPermission(true)
            const fcmToken = await firebase
                .messaging()
                .getToken()

            global.notification_token = fcmToken;
            // console.log(fcmToken);
            if (id) {
                await SendNotification(id, global.notification_token)
            }
        } catch (err) {
            console.log('[updateToken] Error : ', err.message)
        }
    };

    const getAsyncValue = async () => {
        try {
            const themeVal = await AsyncStorage.getItem("theme")
            global.theme = themeVal
            if (!!themeVal) {
                global.theme = themeVal
            }

            const languageVal = await AsyncStorage.getItem("language")
            if (!!languageVal) {
                global.language = languageVal
            } else {
                global.language = "english"
            }
            
            const languageIdVal = await AsyncStorage.getItem("language_id")
            if (!!languageIdVal) {
                global.language_id = languageIdVal
            } else {
                global.language_id = "1"
            }
            
            // const emailVal = await AsyncStorage.getItem("email")
            
            const customerCodeVal = await AsyncStorage.getItem("Customer_code")
            if (!!customerCodeVal) {
                global.customer_code = customerCodeVal
            } else {
                global.customer_code = ""
            }
            
            // AsyncStorage.getItem("password").then((value) => {
            //     if (value !== null) {
            //     } else {
            //     }
            // });
            const userIdVal = await AsyncStorage.getItem("UserId")
            if (!!userIdVal) {
                global.user_id_val = userIdVal
            } else {
                global.user_id_val = ""
            }
            
            const tokenVal = await AsyncStorage.getItem("Token")
            if (!!tokenVal) {
                global.token_val = tokenVal
            } else {
                global.token_val = ""
            }

            const emailIdVal = await AsyncStorage.getItem("EmailId")
            if (!!emailIdVal) {
                global.email_address_val = emailIdVal
            } else {
                global.email_address_val = ""
            }

            const mobileNumberVal = await AsyncStorage.getItem("MobileNumber")
            if (!!mobileNumberVal) {
                global.mobile_number_val = mobileNumberVal
            } else {
                global.mobile_number_val = ""
            }

            const userNameVal = await AsyncStorage.getItem("UserName")
            if (!!userNameVal) {
                global.user_name_val = userNameVal
            } else {
                global.user_name_val = ""
            }
            
            const lastNameVal = await AsyncStorage.getItem("LastName")
            if (!!lastNameVal) {
                global.last_name_val = lastNameVal
            } else {
                global.last_name_val = ""
            }

            const profilePictureVal = await AsyncStorage.getItem("ProfilePicture")
            if (!!profilePictureVal) {
                global.profile_picture = profilePictureVal
            } else {
                global.profile_picture = ""
            }
        } catch (err) {
            console.log('Error : ', err?.message)
        }
    }

    const onNotificationPermissionGranted = async () => {
        try {
            const fcmToken = await firebase.messaging().getToken()
            var formdata = new FormData();
            formdata.append('device_type', Platform.OS);
            formdata.append('device_token', deviceId)
            formdata.append('notification_token', fcmToken)
            
            // console.log("WHEN REGISTER APP", formdata);
            const res = await fetch(APP_URL + 'register-with-device-token', {
                body: formdata,
                method: "POST",
            })
    
            const response = await res.json()
            if (response.status) {
                if (response.data !== null) {
                    await checkPermission(response.data.device_id)
                }
            }
        } catch (err) {
            console.log('[onNotificationPermissionGranted] Error : ', err.message)
        }
    }

    const registerDeviceToken = async () => {
        try {

            const checkMessagingPermission = await firebase.messaging().hasPermission()
            console.log('checkMessagingPermission : ', checkMessagingPermission)

            switch (checkMessagingPermission) {
                case firebase.messaging.AuthorizationStatus.NOT_DETERMINED:
                    {
                        const reqEnabled = await firebase.messaging().requestPermission({
                            alert: true,
                            announcement: true,
                            badge: true,
                            criticalAlert: true,
                            sound: true
                        })

                        console.log('reqEnabled : ', reqEnabled)

                        switch (reqEnabled) {
                            case firebase.messaging.AuthorizationStatus.PROVISIONAL:
                            case firebase.messaging.AuthorizationStatus.AUTHORIZED:
                                await onNotificationPermissionGranted()
                                break
                            case firebase.messaging.AuthorizationStatus.DENIED:
                                break
                        }
                    }
                    break
                case firebase.messaging.AuthorizationStatus.PROVISIONAL:
                case firebase.messaging.AuthorizationStatus.AUTHORIZED:
                    await onNotificationPermissionGranted()
                    break
                case firebase.messaging.AuthorizationStatus.DENIED:
                    break
            }
        } catch (err) {
            console.log('[registerDeviceToken] Error : ', err.message)
        }
    }

    const SendNotification = async (userid, token) => {
        try {
            let headers = {
                'Authorization': 'Bearer ' + global.token_val
            }
            var formdata = new FormData()
            formdata.append('user_id', userid)
            formdata.append('notification_token', token)
            formdata.append('device_type', Platform.OS)
            formdata.append('device_id', deviceId)
            // console.log(formdata, '=========formdata OBJECT');
            const res = await fetch(APP_URL + 'add_notification_token', {
                body: formdata,
                method: 'POST',
                headers: headers
            })

            const response = await res.json()
            console.log("SIGNUP WITH DEVICE TOKEN", response);
        } catch (err) {
            console.log('[SendNotification] Error : ', err.message)
        }
    }

    const initHandler = useCallback(async () => {
        // setTimeout(() => {
        //     console.log('in timer 4500')
        //     setIsShow(true)
        // }, 4500);
        try {
            await getAsyncValue()
            await registerDeviceToken();
            notificationredirect()
            await getCurrency()
            console.log('setRequestPermission : ', true)
            setRequestPermission(true)
            setIsShow(false)
        } catch (err) {
            console.log('[initHandler] Error : ', err.message)
            setIsShow(false)
        }
    }, [])

    useEffect(() => {
        initHandler()
    }, [])

    console.log('isShow || isLoading : ', isShow || isLoading, isShow, isLoading)

    if (isShow || isLoading) {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                <ImageBackground source={Global.GlobalAssets.splashBack}
                    style={{ height: '100%', width: '100%' }}
                    resizeMode={'cover'}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Image
                            source={Global.GlobalAssets.appIcon}
                            style={{ height: scale(330), width: scale(330) }}
                        />
                    </View>
                </ImageBackground>
            </View>
        )
    }

    return (
        <Root>
            {global.token_val!==undefined? RootNavigators("Dashboard"):null}
        </Root>
    );
};
const styles = StyleSheet.create({
});
export default Splash