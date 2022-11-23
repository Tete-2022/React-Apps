import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Keyboard, TouchableOpacity, StyleSheet, Image, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { scale } from '../../Theme/Scalling';
import Global from '../../Global/Globalinclude';
import {
    EMAIL_VALIDATION, ENTER_EMAIL_STR, EMAIL_VALIDATION_STR, ENTER_PASSWORD_STR, APP_URL
} from '../../Global/Helper/Const';
import { NavigationContainer, CommonActions, StackActions } from '@react-navigation/native'
import helpers from '../../Global/Helper/Helper'
import Checkbox from 'react-native-check-box';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import Globalinclude from '../../Global/Globalinclude';
import DeviceInfo from 'react-native-device-info';
const Signin = (props) => {
    const [emailId, setEmailId] = useState('')
    const [password, setPassword] = useState('')
    const [isChecked, setIsChecked] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    useEffect(() => {
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
        AsyncStorage.getItem("email").then((value) => {
            if (value !== null) {
                setEmailId(value)
            } else {
                setEmailId("")
            }
        });
        AsyncStorage.getItem("password").then((value) => {
            if (value !== null) {
                setPassword(value)
            } else {
                setPassword("")
            }
        });
        AsyncStorage.getItem("isRemember").then((value) => {
            if (value !== null) {
                setIsChecked(value === 'true' ? true : false)
            } else {
                setIsChecked(false)
            }
        });
        const unsubscribe = props.navigation.addListener('focus', () => {
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
    const checkPushToken = async (userid) => {
        let token = await helpers.getToken();
        global.notification_token = token
        SendNotification(userid)
    };
    const SendNotification = (userid) => {
        let deviceId = DeviceInfo.getDeviceId();
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        var formdata = new FormData()
        formdata.append('user_id', userid)
        formdata.append('notification_token', global.notification_token)
        formdata.append('device_type', Platform.OS)
        formdata.append('device_id', deviceId)
        console.log(formdata, '=========formdata OBJECT');
        fetch(APP_URL + 'add_notification_token', {
            body: formdata,
            method: 'POST',
            headers: headers
        }).then((res) => res.json()).then((response) => {
            console.log(response);
        }).catch(err => {
            console.log('SendNotification Error : ', err.message)
        })
    }
    const validateSignin = () => {
        if (emailId === "") {
            setEmailError(ENTER_EMAIL_STR)
        } else if (EMAIL_VALIDATION.test(emailId) === false) {
            setEmailError(EMAIL_VALIDATION_STR)
        } else if (password === "") {
            setPasswordError(ENTER_PASSWORD_STR)
        } else {
            if (isChecked) {
                helpers.storeData("email", emailId)
                helpers.storeData("password", password)
                helpers.storeData("isRemember", isChecked ? 'true' : 'false')
            } else {
                helpers.storeData("email", "")
                helpers.storeData("password", "")
                helpers.storeData("isRemember", isChecked ? 'true' : 'false')
            }
            var formdata = new FormData();
            formdata.append('email', emailId)
            formdata.append('password', password)
            global.global_loader_ref.show_loader(1);
            fetch(APP_URL + 'login', {
                body: formdata,
                method: "POST",
            })
                .then((response) => response.json()).then((response) => {
                    global.global_loader_ref.show_loader(0);
                    if (response.status) {
                        global.global_loader_ref.show_loader(0);
                        if (response.data !== null) {
                            global.user_id_val = response.data.id === null ? "" : response.data.id
                            global.email_address_val = response.data.email === null ? "" : response.data.email
                            global.mobile_number_val = response.data.phone_number === null ? "" : response.data.phone_number
                            global.profile_picture = response.data.image === null ? "" : response.data.image
                            global.user_name_val = response.data.first_name === null ? "" : response.data.first_name
                            global.last_name_val = response.data.last_name === null ? "" : response.data.last_name
                            global.customer_code = response.data.customer_code === null ? "" : response.data.customer_code
                            global.token_val = response._token === null ? "" : response._token
                            helpers.storeData("Customer_code", global.customer_code)
                            helpers.storeData("EmailId", global.email_address_val)
                            helpers.storeData("MobileNumber", global.mobile_number_val)
                            helpers.storeData("UserName", global.user_name_val)
                            helpers.storeData("LastName", global.last_name_val)
                            helpers.storeData("Token", global.token_val)
                            helpers.storeData("UserId", JSON.stringify(global.user_id_val))
                            helpers.storeData("ProfilePicture", global.profile_picture)
                            checkPushToken(response.data.id)
                            props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [{ name: "Dashboard" }],
                                }));
                        }
                        Global.showToast(response.message)
                    } else {
                        global.global_loader_ref.show_loader(0);
                        Global.showError(response.message)
                    }
                }).catch((c) => {
                    global.global_loader_ref.show_loader(0);
                }).finally((f) => {
                    global.global_loader_ref.show_loader(0);
                })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? '#000' : '#fff' }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS=='android'?'height':'padding'}>
            <StatusBar backgroundColor={"#ac68ba"} />
            <Image
                source={Global.GlobalAssets.screenLayer2}
                style={{
                    height: '30%',
                    width: '100%',
                    alignSelf: 'flex-start',
                }}
                resizeMode={'cover'}
            />
            <Image
                source={Global.GlobalAssets.screenLayer1}
                style={{
                    height: '30%',
                    width: '100%',
                    alignSelf: 'flex-start',
                    position: 'absolute',
                    top: 0
                }}
                resizeMode={'cover'}
            />
            <View style={{ alignSelf: "center", marginBottom: scale(20) }}>
                <Global.GlobalText text={"LOGIN"} style={{ fontSize: scale(30), color: scheme === 'dark' ? '#ddd' : '#3B3C58' }}
                    underlineStyle={{ marginLeft: scale(20) }}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }}>
                <View style={{ marginTop: scale(30) }}>
                    <Global.GlobalTextBox
                        placeholder="Email Id"
                        label="Email"
                        errortext={emailError}
                        onChangeText={value => {
                            setEmailId(value)
                            setEmailError('')
                        }}
                        value={emailId}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                    <Global.GlobalTextBox
                        placeholder="Password"
                        label="Password"
                        onChangeText={value => {
                            setPassword(value)
                            setPasswordError('')
                        }}
                        value={password}
                        errortext={passwordError}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        secureTextEntry={true}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: scale(15), paddingHorizontal: scale(15) }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Checkbox
                            style={{}}
                            onClick={() => {
                                setIsChecked(!isChecked)
                                // onPressRemember()
                            }}
                            isChecked={isChecked}
                            checkBoxColor={Global.GlobalColor.themeColor}
                        />
                        <View style={{ marginLeft: scale(7) }}>
                            <Text style={[styles.fontStyle, { color: scheme === 'dark' ? Globalinclude.GlobalColor.lightGray : '#484848' }]}>Remember Me</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("ForgotPassword")
                    }}>
                        <Text style={styles.fontStyle}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: scale(20) }}>
                    <Global.GlobalButton text={'Login'}
                        onPress={() => {
                            validateSignin()
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: scale(20), marginBottom: scale(20), alignItems: "center", alignSelf: "center", }}>
                    <Global.GlobalText text={"You don't have an account?"}
                        underLineNot={true}
                        viewStyle={{ paddingHorizontal: scale(0) }}
                        style={{ fontSize: scale(15), color: scheme === 'dark' ? Globalinclude.GlobalColor.lightGray : Global.GlobalColor.themeBlack, fontFamily: Global.GlobalFont.Medium }} />
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Signup')
                        setEmailId("")
                        setPassword("")
                    }}
                    >
                        <Global.GlobalText
                            underLineNot={true}
                            viewStyle={{ paddingHorizontal: scale(0) }}
                            text={' Sign Up'} style={{ fontSize: scale(15), color: Global.GlobalColor.themeColor, fontFamily: Global.GlobalFont.Medium }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    socialIcons: {
        height: scale(40),
        width: scale(40)
    },
    socialIconFb: {
        height: scale(40),
        width: scale(30),
    },
    fontStyle: {
        fontFamily: Global.GlobalFont.Regular,
        color: Global.GlobalColor.themeColor,
        fontSize: scale(15)
    }
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(Signin);