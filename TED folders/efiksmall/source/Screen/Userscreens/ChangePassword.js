import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Keyboard, ImageBackground, StyleSheet } from 'react-native';
import { scale } from '../../Theme/Scalling';
import Global from '../../Global/Globalinclude';
import { ENTER_OLD_PASSWORD_STR, ENTER_NEW_PASSWORD_STR, ENTER_CONFIRM_PASSWORD_STR, APP_URL } from '../../Global/Helper/Const';
import { CommonActions } from '@react-navigation/native'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
const ChangePassword = (props) => {
    const [currentpassword, setCurrentPassword] = useState('')
    const [newpassword, setNewPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [currentpassworderr, setCurrentPasswordError] = useState('')
    const [newpassworderr, setNewPasswordError] = useState('')
    const [confirmpassworderr, setConfirmPasswordError] = useState('')
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
    const validateChangePassword = () => {
        if (currentpassword === "") {
            setCurrentPasswordError(ENTER_OLD_PASSWORD_STR)
        } else if (newpassword === "") {
            setNewPasswordError(ENTER_NEW_PASSWORD_STR)
        } else if (confirmpassword === "") {
            setConfirmPasswordError(ENTER_CONFIRM_PASSWORD_STR)
        } else if (newpassword !== confirmpassword) {
            setConfirmPasswordError("Not match Password and Confirm Password")
        } else {
            var formdata = new FormData();
            let headers = {
                "Authorization": 'Bearer ' + global.token_val
            }
            formdata.append('id', global.user_id_val)
            formdata.append('current_password', currentpassword)
            formdata.append('password', newpassword)
            formdata.append('password_confirmation', confirmpassword)
            global.global_loader_ref.show_loader(1);
            fetch(APP_URL + 'change_password', {
                body: formdata,
                method: "POST",
                headers: headers
            })
                .then((response) => response.json()).then((response) => {
                    if (response.status) {
                        global.global_loader_ref.show_loader(0);
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "Dashboard" }],
                            }));
                        Global.showToast(response.message)
                    } else {
                        global.global_loader_ref.show_loader(0);
                        Global.showError(response.message)
                    }
                })
                .catch(err => {
                    console.log('validateChangePassword Error : ', err.message)
                })
                .finally((f) => {
                    global.global_loader_ref.show_loader(0);
                })
        }
    }
    return (
        <ImageBackground source={Global.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Global.GlobalHeader name={'Change Password'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{}}>
                        <View style={{ marginVertical: scale(30) }}>
                            <Global.GlobalTextBox
                                label="Current Password"
                                placeholder="Current Password"
                                secureTextEntry={true}
                                errortext={currentpassworderr}
                                onChangeText={value => {
                                    setCurrentPassword(value)
                                    setCurrentPasswordError('')
                                }}
                                value={currentpassword}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                                textInputStyle={{
                                    color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                                }}
                            />
                            <Global.GlobalTextBox
                                label="New Password"
                                placeholder="New Password"
                                secureTextEntry={true}
                                errortext={newpassworderr}
                                onChangeText={value => {
                                    setNewPassword(value)
                                    setNewPasswordError('')
                                }}
                                value={newpassword}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                textInputStyle={{
                                    color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                                }}
                                labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                            />
                            <Global.GlobalTextBox
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                secureTextEntry={true}
                                errortext={confirmpassworderr}
                                onChangeText={value => {
                                    setConfirmPassword(value)
                                    setConfirmPasswordError('')
                                }}
                                value={confirmpassword}
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
                                    validateChangePassword()
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(ChangePassword);