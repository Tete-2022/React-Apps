import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, FlatList, Image, Alert } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';
import HTMLView from 'react-native-htmlview';
import helpers from '../../Global/Helper/Helper';
import { CommonActions } from '@react-navigation/native'
import DeviceInfo from 'react-native-device-info';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
let deviceId = DeviceInfo.getDeviceId();
let notificationId = '';
const Notification = (props) => {
    const [notificationData, setNotificationData] = useState([])
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const [load, setLoad] = useState(false)
    useEffect(() => {

        setLoad(false)
        getNotification()
        AsyncStorage.getItem("theme").then((value) => {
            global.theme = value
            if (value !== null && value !== undefined) {
                global.theme = value
                setScheme(value)
            } else {
            }
        }).then(() => {
            setScheme(global.theme);
        })
        const unsubscribe = props.navigation.addListener('focus', () => {
            getNotification()
            setLoad(false)

            AsyncStorage.getItem("theme").then((value) => {
                global.theme = value
                if (value !== null && value !== undefined) {
                    global.theme = value
                    setScheme(value)
                } else {
                }
            }).then(() => {
                setScheme(global.theme);
            })
        });
        return () => {
            unsubscribe();
        };
    }, [])
    const getNotification = () => {
        console.log("deviceId",deviceId)
        setLoad(false)
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        let data = global.user_id_val ? global.user_id_val : deviceId
        fetch(APP_URL + 'get_notifications/' + data, {
            method: "PUT",
            headers: headers,
        })
            .then((res) => res.json()).then((response) => {
                console.log("NOTIFICATION RESPONSE",response)
                if (response.status) {
                    global.global_loader_ref.show_loader(0);
                    if (response.data) {
                        setNotificationData(response.data)
                        setTimeout(() => {
                            setLoad(true)
                        }, 150);
                        notificationId = ""
                        for (let index = 0; index < response.data.length; index++) {
                            const element = response.data[index];
                            if (notificationId === "") {
                                notificationId = response.data[0].id
                            } else {
                                notificationId = notificationId + "," + element.id
                            }
                        }
                        setTimeout(() => {
                            unReadCount(notificationId)
                        }, 50);
                    } else {
                        setLoad(true)
                        setNotificationData([])
                    }
                } else {
                    setLoad(true)
                    setNotificationData([])
                    global.global_loader_ref.show_loader(0);
                }
            }).catch((c) => {
                global.global_loader_ref.show_loader(0);
            }).finally((f) => {
                global.global_loader_ref.show_loader(0);
            })
    }
    const unReadCount = (notificationId) => {
        let notiObj = {
            notification_id: notificationId,
        }
        helpers
            .UrlReq('read_notifications', 'POST', notiObj)
            .then(res => {
                console.log(res, "notification read");
                // global.notification_count = 0
            })
    }
    const NotificationItem = ({ item }) => {
        // console.log(item);
        let final_date = helpers.DateConvert(item.datetime)
        let final_time = helpers.TimeConvert(item.datetime)
        return (
            <View>
                <View
                    style={styles.baseView}
                >
                    <View style={{ paddingHorizontal: scale(10), flexDirection: 'row' }}>
                        <View style={{ width: "80%" }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.messageText}>{item.word_name}</Text>
                        </View>
                        <View style={{ width: "25%", paddingTop: scale(8) }}>
                            <Text style={styles.dateTime}>{item.date}</Text>
                            <Text style={[styles.dateTime, { paddingTop: scale(5) }]}>{item.time}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    const onDeleteNotification = () => {
        let notiObj = {
            notification_id: notificationId,
        }
        helpers
            .UrlReq('remove-all-notifications', 'POST', notiObj)
            .then(res => {
                console.log(res, "notification read");
                // global.notification_count = 0
                if (res.status) {
                    Globalinclude.showToast(res.message)

                    getNotification()
                } else {
                    Globalinclude.showError(res.message)
                }
            })
        let data = global.user_id_val ? global.user_id_val : deviceId
        var formdata = new FormData()
        formdata.append('id', data)
        console.log("id===>", data);

        console.log(global.customer_code, global.token_val);
        fetch(APP_URL + 'remove-all-notifications', {
            method: "POST",
            body: formdata
        })
            .then((res) => res.json()).then((response) => {
                console.log(response, "del response");

                // global.notification_count = 0
            })
            .catch(err => {
                console.log('[onDeleteNotification] Error : ', err.message)
            })
    }
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Globalinclude.GlobalHeader name={'Notification'}
                    drawerIcon={false}
                    deleteIcon={notificationData.length > 0 ? true : false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                    }}
                    onPressDeleteIcon={() => {
                        Alert.alert('Notification', 'Are You Sure Want to Delete All Notification?', [
                            {
                                text: 'Yes',
                                onPress: () => {
                                    onDeleteNotification()
                                },
                            },
                            { text: 'No' },
                        ]);
                    }}
                />
                {load ? (
                    <View style={{ flex: 1 }}>
                        <>
                            {notificationData.length > 0 ? (
                                <>

                                    <ScrollView>
                                        <View style={{ flex: 1, marginTop: scale(7) }}>
                                            <FlatList
                                                data={notificationData}
                                                renderItem={({ item }) => <NotificationItem item={item} />}
                                                keyExtractor={item => item.id}
                                                vertical
                                                style={{ flex: 1 }}
                                            />
                                        </View>
                                    </ScrollView>
                                </>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, alignSelf: 'center' }}>
                                    <Image
                                        source={Globalinclude.GlobalAssets.notigif}
                                        borderRadius={50}
                                        style={{
                                            height: scale(150),
                                            width: scale(230),
                                            borderRadius: scale(10),
                                        }}
                                    />
                                    <View style={{ backgroundColor: "#fff", width: scale(230), padding: scale(10) }}>
                                        <Text style={{ fontFamily: Globalinclude.GlobalFont.Medium, color: Globalinclude.GlobalColor.themeBlue, fontSize: scale(16), textAlign: "center" }}>No Notification Message</Text>
                                    </View>
                                    <View style={{ marginTop: scale(20) }}>
                                        <Globalinclude.GlobalButton text={'Go To Home'}
                                            style={{ paddingHorizontal: scale(50), borderRadius: scale(10) }}
                                            onPress={() => {
                                                // props.navigation.goBack(null)
                                                props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 1,
                                                        routes: [{ name: "Dashboard" }],
                                                    }));
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </>
                    </View>
                ) : <View style={{ alignItems: "center", flexDirection: "row", flex: 1, justifyContent: "center", marginBottom: scale(30) }}>
                    <Text style={{ fontSize: scale(20), fontFamily: Globalinclude.GlobalFont.Medium, color: Globalinclude.GlobalColor.themeGray }}>
                        Loading
                    </Text>
                    <AnimatedEllipsis
                        style={{ fontSize: scale(35), marginTop: -14, color: Globalinclude.GlobalColor.themeGray }}
                    />
                </View>}
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    heading: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(17),
        color: '#000'
    },
    description: { fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(14), },
    dateTime: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(10), color: Globalinclude.GlobalColor.themeBlue,
    },
    title: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(14),
        color: Globalinclude.GlobalColor.themeBlue,
        paddingVertical: scale(3),
    },
    messageText: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(13),
        color: Globalinclude.GlobalColor.themeBlue,
    },
    baseView: {
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: scale(10),
        padding: scale(10),
        elevation: 10,
        shadowColor: Globalinclude.GlobalColor.themeBlue,
        shadowRadius: 10,
        shadowOpacity: 1,
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(Notification);