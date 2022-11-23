import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Keyboard, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { scale } from '../../Theme/Scalling';
import Global from '../../Global/Globalinclude';
import {
    EMAIL_VALIDATION, ENTER_EMAIL_STR, EMAIL_VALIDATION_STR, ENTER_PASSWORD_STR, APP_URL
} from '../../Global/Helper/Const';
import { CommonActions } from '@react-navigation/native'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
const ForgotPassword = (props) => {
    const [emailId, setEmailId] = useState('')
    const [emailError, setEmailError] = useState('')
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
    const validateForgotPassword = () => {
        if (emailId === "") {
            setEmailError(ENTER_EMAIL_STR)
        } else if (EMAIL_VALIDATION.test(emailId) === false) {
            setEmailError(EMAIL_VALIDATION_STR)
        } else {
            var formdata = new FormData();
            formdata.append('email', emailId)
            global.global_loader_ref.show_loader(1);
            fetch(APP_URL + 'forget_password', {
                body: formdata,
                method: "POST",
            })
                .then((response) => response.json()).then((response) => {
                    if (response.status) {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "Signin" }],
                            }));
                        global.global_loader_ref.show_loader(0);
                        Global.showToast(response.message)
                    } else {
                        global.global_loader_ref.show_loader(0);
                        Global.showError(response.message)
                    }
                }).catch((c) => {
                    global.global_loader_ref.show_loader(0);
                })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? '#000' : '#fff' }}>
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
                <Global.GlobalText text={"FORGOT PASSWORD"} style={{ fontSize: scale(26), color: scheme === 'dark' ? '#ddd' : '#3B3C58' }}
                    underlineStyle={{ marginLeft: scale(100) }}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: scale(10) }}>
                    <View style={{ marginHorizontal: scale(30) }}>
                        <Global.GlobalText text={"Please enter your registered Email-ID"}
                            style={{
                                paddingTop: scale(15),
                                fontSize: scale(16),
                                textAlign: "center",
                                color: Global.GlobalColor.themeColor
                            }}
                            underLineNot={true}
                        />
                    </View>
                    <View style={{ marginVertical: scale(30) }}>
                        <Global.GlobalTextBox
                            placeholder="Email Id"
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
                    </View>
                    <View style={{ marginTop: scale(20) }}>
                        <Global.GlobalButton text={'Submit'}
                            onPress={() => {
                                validateForgotPassword()
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(ForgotPassword);