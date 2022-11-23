import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import ToggleSwitch from 'toggle-switch-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux/lib/hooks/useDispatch';
import helpers from '../../Global/Helper/Helper';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';
import DeviceInfo from 'react-native-device-info';
let deviceId = DeviceInfo.getDeviceId();
const Setting = (props) => {
    const [isOn, setIsOn] = useState()
    const [settings,setSettings] = useState(global.setting_menu);
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const [theme, setTheme] = useState(global.theme === 'light' ? 'Default' : 'Dark')
    const dispatch = useDispatch()
    AsyncStorage.getItem("theme").then((value) => {
        global.theme = value
        if (value !== null && value !== undefined) {
            global.theme = value
        } else {
        }
    }).then(() => {
        setScheme(global.theme);
    })
    useEffect(() => {
        AsyncStorage.getItem("theme").then((value) => {
            getProfile()
            if (value !== null && value !== undefined) {
                global.theme = value
                setTheme(global.theme === 'light' ? 'Default' : 'Dark')
            } else {
                global.theme = null
                setTheme('Default')
            }
        }).then(() => {
            setScheme(global.theme);
        })
    }, [])
    const getProfile = () => {
        let headers = {
            'Accept': 'application/json'
        }
        global.global_loader_ref.show_loader(1);
        let data = global.user_id_val ? global.user_id_val : deviceId
        fetch(APP_URL + 'edit_user/' + data, {
            method: "PUT",
            headers: headers,
        })
            .then((response) => response.json()).then((response) => {
                if (response.status) {
                    if (response.data) {
                        setIsOn(response.data.notification_enable === 0 ? false : true)
                        global.global_loader_ref.show_loader(0);
                    }
                    global.global_loader_ref.show_loader(0);
                } else {
                    global.global_loader_ref.show_loader(0);
                }
            }).catch((c) => {
                global.global_loader_ref.show_loader(0);
            }).finally((f) => {
                global.global_loader_ref.show_loader(0);
            })
    }
    const getTheme = (item) => {
        if (item === 'Default') {
            global.theme = 'light'
            setScheme('light')
            dispatch({ type: "APPS.THEME" })
            helpers.storeData('theme', 'light')
        } else {
            global.theme = 'dark'
            setScheme('dark')
            dispatch({ type: "APPS.THEME" })
            helpers.storeData('theme', 'dark')
        }
    }
    const toggleSwitch = () => {
        setTimeout(() => {
            notificationOnOffApi()
        }, 20);
    }
    const notificationOnOffApi = () => {
        setIsOn(previousState => !previousState);
        var formdata = new FormData()
        formdata.append('user_id', global.user_id_val ? JSON.parse(global.user_id_val) : deviceId)
        formdata.append('notification_enable', isOn ? "0" : "1")
        fetch(APP_URL + 'change_notification_status', {
            body: formdata,
            method: 'POST'
        }).then((res) => res.json()).then((ress) => {
            console.log(ress, "res");
        }).catch(err => {
            console.log('notificationOnOffApi Error : ', err.message)
        })
    }
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)' }}>
                <Globalinclude.GlobalHeader name={'Settings'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                        props.navigation.openDrawer()
                    }}
                />
                <View style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Word of the Day notification</Text>
                    </View>
                    <View>
                        <ToggleSwitch
                            isOn={isOn}
                            onColor={Globalinclude.GlobalColor.themeColor}
                            offColor={Globalinclude.GlobalColor.themeGray}
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="medium"
                            onToggle={() => {
                                toggleSwitch()
                            }}
                        />
                    </View>
                </View>
                <View style={{ borderBottomWidth: 2, borderColor: '#dadada', }} />
                <TouchableOpacity style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                    onPress={() => {
                        props.navigation.navigate("PrivacyPolicy")
                    }}
                >
                    <View>
                        <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Privacy Policy</Text>
                    </View>
                    <View>
                        <Image
                            source={Globalinclude.GlobalAssets.rightArrow}
                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                        />
                    </View>
                </TouchableOpacity>
                <View style={{ borderBottomWidth: 2, borderColor: '#dadada', }} />
                <TouchableOpacity style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                    onPress={() => {
                        props.navigation.navigate("Terms")
                    }}
                >
                    <View>
                        <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Terms & Conditions</Text>
                    </View>
                    <View>
                        <Image
                            source={Globalinclude.GlobalAssets.rightArrow}
                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                        />
                    </View>
                </TouchableOpacity>

                {global.user_id_val ? (
                    <>
                        <View style={{ borderBottomWidth: 2, borderColor: '#dadada', }} />

                        <TouchableOpacity style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                            onPress={() => {
                                props.navigation.navigate("ChangePassword")
                            }}
                        >
                            <View>
                                <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Change Password</Text>
                            </View>
                            <View>
                                <Image
                                    source={Globalinclude.GlobalAssets.rightArrow}
                                    style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                />
                            </View>
                        </TouchableOpacity>
                    </>
                ) : null}

                {
                    settings=='off'?null:

               global.user_id_val ? (
                    <>
                        <View style={{ borderBottomWidth: 2, borderColor: '#dadada', }} />

                        <TouchableOpacity style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                            onPress={() => {
                                props.navigation.navigate("PlanHistory")
                            }}
                        >
                            <View>
                                <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Transaction History</Text>
                            </View>
                            <View>
                                <Image
                                    source={Globalinclude.GlobalAssets.rightArrow}
                                    style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                />
                            </View>
                        </TouchableOpacity>
                    </>
                ) : null
                }
                <View style={{ borderBottomWidth: 2, borderColor: '#dadada', }} />
                <View style={{ paddingVertical: scale(20), paddingHorizontal: scale(20), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text style={[styles.name, { color: scheme == 'dark' ? '#ffffff' : Globalinclude.GlobalColor.themeBlack }]}>Appearances</Text>
                    </View>
                    <DropDownPicker
                        items={[
                            { id: 1, label: 'Default', value: 'Default' },
                            { id: 2, label: 'Dark', value: 'Dark' },
                        ]
                        }
                        value={theme}
                        containerStyle={{
                            width: scale(160),
                            alignSelf: 'center',
                            height: scale(55), marginLeft: scale(20)
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                            height: scale(35),
                        }}
                        style={styles.dropStyle}
                        labelStyle={{
                            color: '#7A7A7A',
                            fontFamily: Globalinclude.GlobalFont.Regular,
                            fontSize: scale(14),
                        }}
                        activeLabelStyle={{
                            color: Globalinclude.GlobalColor.themeBlack,
                            fontFamily: Globalinclude.GlobalFont.Regular,
                            fontSize: scale(14),
                        }}
                        onChangeItem={item => {
                            setTheme(item.value);
                            getTheme(item.value)
                        }}
                        placeholder={theme}
                        placeholderStyle={{
                            fontFamily: Globalinclude.GlobalFont.Regular,
                            color: Globalinclude.GlobalColor.themeGray,
                        }}
                        arrowColor={'#7A7A7A'}
                    />
                </View>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    name: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(15),
        color: '#565656'
    }, dropStyle: {
        backgroundColor: 'white',
        height: scale(50),
        width: scale(160),
        marginVertical: scale(8),
        alignSelf: 'center',
        borderColor: '#dadada',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
const mapDispatchToProps = (dispatch) => {
    dispatch({ type: "APPS.THEME" });
    return {
        // dispatching plain actions
        appTheme: dispatch({ type: "APPS.THEME" })
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Setting);