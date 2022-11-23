
import { APP_URL, API_KEY, APP_NAME } from './Const';
import AsyncStorage from '@react-native-community/async-storage';
import { PhoneNumberUtil } from 'google-libphonenumber';
var PNF = require('google-libphonenumber').PhoneNumberFormat;
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import moment from "moment";
const phoneUtil = PhoneNumberUtil.getInstance();

const helpers = {

    UrlReq: async function (url, method, bodydata, image) {
        let responce = [];

        let headers = new Headers();
        headers.set('Authorization', 'Bearer ' + global.token_val);

        const loginString = JSON.stringify(bodydata);
        var formdata = new FormData();
        formdata.append('data', loginString);

        try {
            const response = await fetch(APP_URL + url, {
                method: method,
                body: formdata,
                headers: headers,
            });
            let responseJson = await response.json();
            responce.push(responseJson);
            return responce[0];
        } catch (err) {
            responce.push(err);

            return responce[0];
        }
    },
    UrlReqAuthPost: async function (url, method, bodydata) {
        let responce = [], formdata = "";
        let headers = new Headers();
        const result = global.token_val


        headers.set('Authorization', global.token_val);

        if (bodydata === "") {
            formdata = ""
        } else {
            const loginString = JSON.stringify(bodydata);
            formdata = new FormData();
            formdata.append('data', loginString);
        }
        try {

            const response = await fetch(APP_URL + url, {
                method: method,
                body: formdata,
                headers: headers,
            });
            let responseJson = await response.json();

            responce.push(responseJson);
            return responce[0];
        } catch (err) {
            responce.push(err);

            return responce[0];
        }
    },

    getDataWithToken: async function (url, method, bodydata) {
        let responce = [], formdata = "";
        let headers = new Headers();

        headers.set('x-authorization', global.token_val);


        try {
            const response = await fetch(APP_URL + url, {
                method: method,

                headers: headers,
            });
            let responseJson = await response.json();


            responce.push(responseJson);
            return responce[0];
        } catch (err) {
            responce.push(err);

            return responce[0];
        }

    },
    storeData: async (name, value) => {
        try {
            await AsyncStorage.setItem(name, value);
        } catch (e) {
            // saving error
        }
    },
    getSampleNumber: function (region) {
        var number = phoneUtil.getExampleNumber(region);

        var sample = phoneUtil.getExampleNumberForType(region, 0);

        // console.log('====================================');
        // console.log('sample', sample.getNationalNumber());
        // console.log('====================================');


        return `${number.getCountryCodeOrDefault()} ${number.getNationalNumber()}`;

    },
    validatePhone: function (phone, region) {
        try {
            const parsedNumber = phoneUtil.parse(phone, region);
            return phoneUtil.isValidNumber(parsedNumber);
        } catch (err) {
            console.log('err', err);
            return false;
        }
    },
    maskPhoneNumber: function (phone, region) {
        try {
            const parsedNumber = phoneUtil.parse(phone, region);
            let formattedNumber = phoneUtil.format(parsedNumber, PNF.INTERNATIONAL);

            return formattedNumber.replace(/.(?=\d{6})/g, '#');
        } catch (err) {
            return phone;
        }
    },
    getFormattedNumber: function (phone, region) {
        try {
            const parsedNumber = phoneUtil.parse(phone, region);
            let formattedNumber = phoneUtil.format(parsedNumber, PNF.INTERNATIONAL);

            return formattedNumber;
        } catch (err) {
            return phone;
        }
    },
    getToken: async function () {
        let fcmToken = await messaging().getToken();
        console.log("FCMMMM", fcmToken);
        if (fcmToken) {
            AsyncStorage.setItem('fcmToken', fcmToken);
            // user has a device token
        } else {
            // user doesn't have a device token yet
        }
        return fcmToken ? fcmToken : '';
    },
    presentNotification: function (from, notification) {
        const title = notification?.data?.title;
        const body = notification?.data?.body;
        const icon = notification?.data?.imagelink;

        if (Platform.OS === 'android') {
            var notificationObj = {
                title: title,
                message: body,
                bigText: body,
                bigPictureUrl: icon,
                vibrate: true,
                vibration: 100,
                onlyAlertOnce: true,
                allowWhileIdle: true,
                invokeApp: true,
                importance: 'max',
                priority: 'max',
                ignoreInForeground: false,
                foreground: true,
                channelId: APP_NAME,
                smallIcon: 'ic_launcher',
            };
            if (icon !== '') {
                notificationObj.largeIconUrl = icon;
            } else {
                notificationObj.largeIcon = 'ic_launcher';
            }
            PushNotification.channelExists(APP_NAME, (status) => {
                if (status) {
                    PushNotification.presentLocalNotification(notificationObj);
                } else {
                }
            });
        } else if (Platform.OS === 'ios') {
            let details = {
                alertBody: body,
                alertTitle: title,
                alertAction: 'view',
                userInfo: notification.data,
            };
            if (global.nextAppState === 'active' && !global.isNotificationTap) {
                PushNotificationIOS.addNotificationRequest(details);
            }
        }
        return Promise.resolve();
    },
    requestUserPermission: async function () {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) { }

        return enabled;
    },
    ConvertDate: function (date) {
        return moment(date).format("DD-MM-YYYY")
    },
    DateConvert: function (date) {

        return moment(date).format("DD/MM/YYYY")
    },
    TimeConvert: function (date) {
        return moment(date).format("hh:mm:ss")
    },
}
export default helpers;