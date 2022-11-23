import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Keyboard, TouchableOpacity, StyleSheet, Image, Platform, StatusBar ,KeyboardAvoidingView} from 'react-native';
import { scale } from '../../Theme/Scalling';
import Global from '../../Global/Globalinclude';
import {
    ENTER_NAME_STR, ENTER_MOBILENO_STR, MOBILE_VALIDATION,
    EMAIL_VALIDATION, ENTER_EMAIL_STR, EMAIL_VALIDATION_STR, ENTER_PASSWORD_STR, PASSWORD_MATCH_STR, ENTER_CONFIRM_PASSWORD_STR, APP_URL, NAME_VALIDATION, MOBILENO_DEGITVALIDATION_STR2, MOBILENO_VALIDATION_STR
} from '../../Global/Helper/Const';
import { CommonActions } from '@react-navigation/native'
import helpers from '../../Global/Helper/Helper'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import CountryCodePicker from '../../Component/CodePicker';
import countries from '../../Global/Helper/country.json';
import DeviceInfo from 'react-native-device-info';
import showError from '../../Component/ShowError';
let deviceId = DeviceInfo.getDeviceId();
let defaultCountry = countries[157];
let errorCount = 0;
global.sample_number_is = 'Sample number is : ';
const SignUp = (props) => {
    const ref = useRef();
    const [showPicker, setshowPicker] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
    const [samplecode, setSampleCode] = useState(global.sample_number_is + ' ' + '234 1234567890')
    // const [samplecode, setSampleCode] = useState(`${global.sample_number_is} ${helpers.getSampleNumber('NG')}`)
    const [emailId, setEmailId] = useState('')
    const [mobilenumber, setMobileNumber] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [emailerror, setEmailError] = useState('')
    const [mobileerror, setMobileNumberError] = useState('')
    const [firstnameerror, setFirstNameError] = useState('')
    const [lastnameerror, setLastNameError] = useState('')
    const [passworderror, setPasswordError] = useState('')
    const [confirmpassworderror, setConfirmPasswordError] = useState('')
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    useEffect(() => {
        for (let index = 0; index < countries.length; index++) {
            // console.log(countries[index])
            if (countries[index].callingCode === '234') {
                console.log(index, countries[index].code);
            }
        }
        errorCount = 0;
        // getSelectedCountry()
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
            // getSelectedCountry()
        });
        return () => {
            unsubscribe();
        };
    }, [])
    // const getSelectedCountry = () => {
    //     AsyncStorage.getItem('country_code').then(value => {
    //         if (value !== null) {
    //             global.county_code_val = value.toString();
    //             setSelectedCountryCode(value.toString());
    //         } else {
    //             global.county_code_val = countries[234].callingCode;
    //             setSelectedCountryCode(countries[234].callingCode);
    //         }
    //     });
    //     AsyncStorage.getItem('flag_name').then(value => {
    //         if (value !== null) {
    //             global.flag_name_val = value.toString();
    //             setSelectedCountryImage(value.toString());
    //         } else {
    //             global.flag_name_val = countries[234].flag;
    //             setSelectedCountryImage(countries[234].flag);
    //         }
    //     });
    // };
    const validateSignup = () => {
        if (firstname === "") {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setFirstNameError("Enter First Name")
        }
        else if (!NAME_VALIDATION.test(firstname)) {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setFirstNameError("Only Digit is not allowed in Name")
        }
        else if (lastname === "") {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setLastNameError("Enter Last Name")
        }
        else if (!NAME_VALIDATION.test(lastname)) {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setLastNameError("Only Digit is not allowed in Name")
        }
        else if (emailId === "") {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setEmailError(ENTER_EMAIL_STR)
        } else if (EMAIL_VALIDATION.test(emailId) === false) {
            if (ref.current !== null) {
                ref.current.scrollTo({ x: 0, y: 0, animated: true });
            }
            setEmailError(EMAIL_VALIDATION_STR)
        } else if (mobilenumber === "") {
            setMobileNumberError(ENTER_MOBILENO_STR);
        }
        // else if (MOBILE_VALIDATION.test(mobilenumber) === false) {
        //     setMobileNumberError(MOBILENO_VALIDATION_STR)
        // } 
        else if (selectedCountry.callingCode === '234') {
            console.log(mobilenumber.length);
            if (mobilenumber.trim().length !== 10) {
                setSampleCode(
                    global.sample_number_is + ' ' + '234 1234567890'
                );
                setMobileNumberError(MOBILENO_DEGITVALIDATION_STR2);
            } else {
                if (password === "") {
                    setMobileNumberError("")
                    setPasswordError(ENTER_PASSWORD_STR)
                } else if (confirmpassword === "") {
                    setConfirmPasswordError(ENTER_CONFIRM_PASSWORD_STR)
                } else if (password !== confirmpassword) {
                    setConfirmPasswordError(PASSWORD_MATCH_STR)
                } else {
                    callSignup()
                }
            }
        }
        else if (
            !helpers.validatePhone(
                `${selectedCountry.callingCode}${mobilenumber.trim()}`,
                selectedCountry.code,
            )
        ) {
            errorCount++;
            if (errorCount > 1) {
                let sampleNumber = helpers.getSampleNumber(selectedCountry.code);
                errorCount = 0;
                setMobileNumberError("Please Enter Valid Mobile Number");
            }
            else {
                setMobileNumberError("Please Enter Valid Mobile Number");
            }
        } else if (MOBILE_VALIDATION.test(mobilenumber) === false) {
            setMobileNumberError(MOBILENO_VALIDATION_STR)
        } else if (selectedCountry.callingCode === '91') {
            if (mobilenumber.trim().length !== 10) {
                setMobileNumberError(MOBILENO_DEGITVALIDATION_STR2);
            } else if (password === "") {
                setMobileNumberError("")
                setPasswordError(ENTER_PASSWORD_STR)
            } else if (confirmpassword === "") {
                setConfirmPasswordError(ENTER_CONFIRM_PASSWORD_STR)
            } else if (password !== confirmpassword) {
                setConfirmPasswordError(PASSWORD_MATCH_STR)
            } else {
                callSignup()
            }
        }
        else if (password === "") {
            setMobileNumberError("")
            setPasswordError(ENTER_PASSWORD_STR)
        } else if (confirmpassword === "") {
            setConfirmPasswordError(ENTER_CONFIRM_PASSWORD_STR)
        } else if (password !== confirmpassword) {
            setConfirmPasswordError(PASSWORD_MATCH_STR)
        } else {
            callSignup()
        }
    }
    const checkPushToken = async (userid) => {
        let token = await helpers.getToken();
        global.notification_token = token
        SendNotification(userid)
    };
    const SendNotification = (userid) => {
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        var formdata = new FormData()
        formdata.append('user_id', userid)
        formdata.append('notification_token', global.notification_token)
        formdata.append('device_type', Platform.OS)
        formdata.append('device_id', deviceId)
        console.log('=========add_notification_token api OBJECT======', formdata);
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
    const callSignup = () => {
        setMobileNumberError("")
        global.global_loader_ref.show_loader(1);
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        var formdata = new FormData();
        formdata.append("first_name", firstname);
        formdata.append("last_name", lastname);
        formdata.append("email", emailId);
        formdata.append("phone_no", mobilenumber);
        formdata.append("password_confirmation", confirmpassword);
        formdata.append("password", password);
        formdata.append("country_code", '+' + selectedCountry.callingCode);

        formdata.append("device_token", deviceId);
        console.log(formdata);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        fetch(APP_URL + "register", requestOptions)
            .then(async response => {
                return response.json()
            })
            .then(result => {
                console.log(result);
                if (result.status) {
                    global.global_loader_ref.show_loader(0);
                    global.user_id_val = result.data.id === null ? "" : result.data.id
                    global.customer_code = result.data.customer_code === null ? "" : result.data.customer_code
                    global.email_address_val = result.data.email === null ? "" : result.data.email
                    global.mobile_number_val = result.data.phone_number === null ? "" : result.data.phone_number
                    global.user_name_val = result.data.name === null ? "" : result.data.first_name + ' ' + result.data.last_name
                    global.token_val = result._token === null ? "" : result._token
                    global.profile_picture = result.data.image === null ? "" : result.data.image
                    helpers.storeData("EmailId", global.email_address_val)
                    helpers.storeData("MobileNumber", global.mobile_number_val)
                    helpers.storeData("UserName", global.user_name_val)
                    helpers.storeData("Token", global.token_val)
                    helpers.storeData("Customer_code", global.customer_code)
                    helpers.storeData("UserId", JSON.stringify(global.user_id_val))
                    helpers.storeData("ProfilePicture", global.profile_picture)
                    checkPushToken(result.data.id)
                    Global.showToast(result.message)
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: "Dashboard" }],
                        }));
                    // props.navigation.navigate("Dashboard")
                } else {
                    Global.showError(result.message)
                    global.global_loader_ref.show_loader(0);
                }
            })
            .catch(error => {
                console.log('error', error.message)
                showError(error.message)
                global.global_loader_ref.show_loader(0);
            });
    }
    let callingCode =
        selectedCountry != null ? '+' + selectedCountry.callingCode : '';
    let flagName = selectedCountry != null ? selectedCountry.flag : '';
    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS=='android'?'height':'padding'} style={{ flex: 1, backgroundColor: scheme === 'dark' ? '#000' : '#fff' }}>
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
                <Global.GlobalText text={"SIGN UP"} style={{ fontSize: scale(30), color: scheme === 'dark' ? '#ddd' : '#3B3C58' }}
                    underlineStyle={{ marginLeft: scale(30) }}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                ref={ref}
            >
                <View style={{ marginVertical: scale(30) }}>
                    <Global.GlobalTextBox
                        placeholder="Enter First Name"
                        label="First Name"
                        onChangeText={value => {
                            setFirstName(value)
                            setFirstNameError('')
                        }}
                        value={firstname}
                        errortext={firstnameerror}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                    <Global.GlobalTextBox
                        placeholder="Enter Last Name"
                        label="Last Name"
                        onChangeText={value => {
                            setLastName(value)
                            setLastNameError('')
                        }}
                        value={lastname}
                        errortext={lastnameerror}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                    <Global.GlobalTextBox
                        placeholder="Enter Email"
                        label="Email"
                        onChangeText={value => {
                            setEmailId(value)
                            setEmailError('')
                        }}
                        value={emailId}
                        errortext={emailerror}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                    <View
                        style={{
                            marginHorizontal: scale(20), marginBottom: scale(20), marginTop: scale(10)
                        }}>
                        <Text
                            style={{
                                fontFamily: Global.GlobalFont.Medium,
                                fontSize: scale(14),
                                fontStyle: 'normal',
                                color: scheme === 'dark' ? '#fff' : Global.GlobalColor.themeBlack
                            }}>
                            Number
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginTop: scale(-40) }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.mobileView}
                            onPress={() => { setshowPicker(true) }}>
                            {props.color === undefined ?
                                <Image source={{ uri: flagName }} style={styles.flag} /> : null}
                            <Text
                                style={[styles.prefix, { color: scheme === 'dark' ? '#fff' : '#000' }]}>
                                {selectedCountry.callingCode}
                            </Text>
                        </TouchableOpacity>
                        <Global.GlobalTextBox
                            placeholder="Enter Number"
                            // showPhoneNumber={true}
                            //errortext={mobileerror}
                            onChangeText={value => { setMobileNumber(value); }}
                            value={mobilenumber}
                            keyboardType="number-pad"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            // maxLength={10}
                            labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                            textInputStyle={{
                                color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                            }}
                            viewStyle={{ width: scale(240), marginTop: scale(30) }}
                        />
                    </View>
                    {showPicker ? (
                        <CountryCodePicker
                            close={() => {
                                setshowPicker(false);
                            }}
                            action={(item) => {
                                if (item != null) {
                                    setSampleCode("")
                                    let countryName = item.name;
                                    let callingCode = item.callingCode;
                                    global.county_code_val = '+' + item.callingCode;
                                    global.country_name = countryName;
                                    setSelectedCountry(item)
                                    // let sampleNumber = helpers.getSampleNumber(selectedCountry.code);
                                    // alert(sampleNumber)
                                    if (item.callingCode === '234') {

                                        setSampleCode(
                                            global.sample_number_is + ' ' + '234 1234567890'
                                        );
                                    } else {

                                        setSampleCode(
                                            `${global.sample_number_is} ${helpers.getSampleNumber(item.code)}`,
                                        );
                                    }
                                    setshowPicker(!showPicker)
                                } else {
                                    global.county_code_val = '';
                                    global.country_name = '';
                                    setSelectedCountry(null)
                                    setshowPicker(!showPicker)
                                }
                            }}
                        />
                    ) : null}
                    {samplecode !== '' ? (
                        <View style={{ marginTop: scale(-15), marginBottom: scale(20) }}>
                            <Text
                                style={[styles.errorTextStyle, { color: Global.GlobalColor.themeColor, fontFamily: Global.GlobalFont.Medium }]}>
                                *{samplecode}
                            </Text>
                        </View>
                    ) : <View style={{ marginTop: scale(0) }}>
                    </View>}
                    {mobileerror !== '' ? (
                        <View style={{ marginTop: scale(-10) }}>
                            <Text
                                style={styles.errorTextStyle}>
                                {mobileerror}
                            </Text>
                        </View>
                    ) : <View style={{ marginTop: scale(-20) }}>
                    </View>}
                    <Global.GlobalTextBox
                        placeholder="Enter Password"
                        label="Password"
                        onChangeText={value => { setPassword(value); setPasswordError('') }}
                        value={password}
                        errortext={passworderror}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        secureTextEntry={true}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                    <Global.GlobalTextBox
                        placeholder="Enter Confirm Password"
                        label="Confirm Password"
                        errortext={confirmpassworderror}
                        onChangeText={value => { setConfirmPassword(value); setConfirmPasswordError('') }}
                        value={confirmpassword}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        secureTextEntry={true}
                        labelStyle={{ color: scheme === 'dark' ? '#fff' : '#484848' }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                    />
                </View>
                <View style={{}}>
                    <Global.GlobalButton text={'Sign Up'}
                        onPress={() => {
                            validateSignup()
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: scale(20), alignItems: "center", alignSelf: "center" }}>
                    <View>
                        <Global.GlobalText text={"Already have an account?"}
                            underLineNot={true}
                            viewStyle={{ paddingHorizontal: scale(0) }}
                            style={{ fontSize: scale(15), color: scheme === 'dark' ? Global.GlobalColor.lightGray : Global.GlobalColor.themeBlack, fontFamily: Global.GlobalFont.Medium }} />
                    </View>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Signin')
                    }}
                    >
                        <Global.GlobalText
                            underLineNot={true}
                            viewStyle={{ paddingHorizontal: scale(0) }}
                            text={' Login '} style={{ fontSize: scale(15), color: Global.GlobalColor.themeColor, fontFamily: Global.GlobalFont.Medium }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}
const styles = StyleSheet.create({
    flag: {
        width: 20,
        height: 20,
        borderRadius: 0,
    },
    prefix: {
        paddingHorizontal: scale(5),
        fontFamily: Global.GlobalFont.Medium,
        color: "#484848",
        textAlign: 'center',
        alignSelf: 'center',
    },
    mobileView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', alignSelf: 'center',
        // paddingLeft: scale(10)
        marginLeft: scale(10),
        borderWidth: scale(1.5), borderColor: "#ddd",
        paddingVertical: scale(10), borderRadius: scale(30),
        paddingHorizontal: scale(10),
        marginTop: scale(8)
    }, errorTextStyle: {
        color: 'red', paddingTop: scale(-25),
        paddingStart: scale(20),
        fontFamily: Global.GlobalFont.Regular,
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(SignUp);