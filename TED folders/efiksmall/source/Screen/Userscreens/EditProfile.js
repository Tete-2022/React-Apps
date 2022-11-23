import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, Modal, Keyboard } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import { APP_URL, EMAIL_VALIDATION, EMAIL_VALIDATION_STR, ENTER_EMAIL_STR, ENTER_MOBILENO_STR, MOBILENO_DEGITVALIDATION_STR, MOBILENO_DEGITVALIDATION_STR2, MOBILENO_VALIDATION_STR, MOBILE_VALIDATION, NAME_VALIDATION } from '../../Global/Helper/Const';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import helpers from '../../Global/Helper/Helper';
import CountryCodePicker from '../../Component/CodePicker';
import countries from '../../Global/Helper/country.json';
import { CommonActions } from '@react-navigation/routers';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const IMG_CONTAIN = 'contain';
const options = {
    maxWidth: 720,
    maxHeight: 1024,
    allowsEditing: false,
    mediaType: 'photo',
    includeBase64: false,
    saveToPhotos: false,
    selectionLimit: 1,
    storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
    },
};
let defaultCountry = countries[97];
let errorCount = 0;
global.sample_number_is = 'Sample number is : ';
let callingCode =
    '';
let flagName = '';
const EditProfile = (props) => {
    const [samplecode, setSampleCode] = useState(`${global.sample_number_is} ${helpers.getSampleNumber('IN')}`)
    const [showPicker, setshowPicker] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
    const [imageresponse, setImageResponse] = React.useState(null);
    const [imagePath, setImagePath] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [emailId, setEmailId] = useState('')
    const [mobilenumber, setMobileNumber] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [customer_code, setCustomerCode] = useState('')
    const [emailerror, setEmailError] = useState('')
    const [mobileerror, setMobileNumberError] = useState('')
    const [firstnameerror, setFirstNameError] = useState('')
    const [lastnameerror, setLastNameError] = useState('')
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const openFilter = (visible) => {
        setFilterVisible(visible);
    };
    useEffect(() => {
        getProfile()
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
            getProfile()
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
    const getProfile = () => {
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        global.global_loader_ref.show_loader(1);
        fetch(APP_URL + 'edit_user/' + global.user_id_val, {
            method: "PUT",
            headers: headers,
        })
            .then((response) => response.json()).then((response) => {
                if (response.status) {
                    if (response.data) {
                        global.profile_picture = response.data.image === null ? "" : response.data.image
                        global.user_name_val = response.data.first_name === null ? "" : response.data.first_name + ' ' + response.data.last_name
                        setImagePath(response.data.image ? response.data.image : '')
                        setFirstName(response.data.first_name ? response.data.first_name : '')
                        setLastName(response.data.last_name ? response.data.last_name : '')
                        setCustomerCode(response.data.customer_code ? response.data.customer_code : '')
                        setEmailId(response.data.email ? response.data.email : '')
                        setMobileNumber(response.data.phone_no ? response.data.phone_no : '')
                        console.log(response.data.country_code.substring(1));
                        for (let index = 0; index < countries.length; index++) {

                            if (countries[index].callingCode == response.data.country_code.substring(1)) {
                                callingCode =
                                    selectedCountry != null ? '+' + selectedCountry.callingCode : '';
                                flagName = selectedCountry != null ? countries[index].flag : '';
                                setSelectedCountry({ callingCode: countries[index].callingCode, flag: countries[index].flag, code: countries[index].code })
                                if (countries[index].code === 'NG') {
                                    setSampleCode(global.sample_number_is + ' ' + '234 1234567890')

                                } else {

                                    setSampleCode(`${global.sample_number_is} ${helpers.getSampleNumber(countries[index].code)}`)
                                }
                            }
                        }
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
    const OpenGallery = () => {
        setFilterVisible(false);
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
            } else {
                setImageResponse(response.assets[0]);
                setImagePath(response.assets[0].uri);
            }
        });
    };
    const OpenCamera = () => {
        setFilterVisible(false);
        launchCamera(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorMessage) {
            } else {
                setImageResponse(response.assets[0]);
                setImagePath(response.assets[0].uri);
            }
        });
    };
    const validateProfile = () => {
        if (firstname === "") {
            setFirstNameError("Enter First Name")
        }
        else if (!NAME_VALIDATION.test(firstname)) {
            setFirstNameError("Only Digit is not allowed in Name")
        }
        else if (lastname === "") {
            setLastNameError("Enter Last Name")
        }
        else if (!NAME_VALIDATION.test(lastname)) {
            setLastNameError("Only Digit is not allowed in Name")
        }
        else if (emailId === "") {
            setEmailError(ENTER_EMAIL_STR)
        } else if (EMAIL_VALIDATION.test(emailId) === false) {
            setEmailError(EMAIL_VALIDATION_STR)
        } else if (mobilenumber === "") {
            setMobileNumberError(ENTER_MOBILENO_STR);
        }
        // else if (mobilenumber.length < 10) {
        //     setMobileNumberError(MOBILENO_DEGITVALIDATION_STR2);
        // } else if (MOBILE_VALIDATION.test(mobilenumber) === false) {
        //     setMobileNumberError(MOBILENO_DEGITVALIDATION_STR)
        // }
        else if (selectedCountry.callingCode === '234') {
            if (mobilenumber.trim().length !== 10) {
                setSampleCode(
                    global.sample_number_is + ' ' + '234 1234567890'
                );
                setMobileNumberError(MOBILENO_DEGITVALIDATION_STR2);
            } else {
                setMobileNumberError("")
                updateProfile()
            }
        }
        else if (selectedCountry.callingCode === '91') {
            if (mobilenumber.trim().length !== 10) {
                setSampleCode(
                    global.sample_number_is + ' ' + '91 7410410123'
                );
                setMobileNumberError(MOBILENO_DEGITVALIDATION_STR2);
            } else {
                setMobileNumberError("")
                updateProfile()
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
                setMobileNumberError(
                    `${global.sample_number_is} ${sampleNumber}`,
                );
            }
            else {
                setMobileNumberError("Please Enter Valid Mobile Number");
            }
        } else if (MOBILE_VALIDATION.test(mobilenumber) === false) {
            setMobileNumberError(MOBILENO_VALIDATION_STR)
        }
        else {
            setMobileNumberError("")
            updateProfile()
        }
    }
    const updateProfile = () => {
        global.global_loader_ref.show_loader(1);
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        var formdata = new FormData();
        formdata.append('id', global.user_id_val)
        formdata.append('first_name', firstname)
        formdata.append('last_name', lastname)
        formdata.append('email', emailId)
        formdata.append('phone_no', mobilenumber)
        formdata.append('customer_code', customer_code)
        formdata.append('country_code', '+' + selectedCountry.callingCode)

        let imageDetail = null;
        if (imageresponse !== null) {
            imageDetail = JSON.parse(JSON.stringify(imageresponse));
        }
        if (imageDetail !== null) {
            var path = imageDetail.uri;
            let imageName = '';
            if (
                imageDetail.fileName === undefined ||
                imageDetail.fileName == null ||
                imageDetail.fileName === ''
            ) {
                var getFilename = path.split('/');
                imageName = getFilename[getFilename.length - 1];
                var extension = imageName.split('.')[1];
                imageName = new Date().getTime() + '.' + extension;
            } else {
                imageName = imageDetail.fileName;
            }
            // let imagePath =
            //     Platform.OS === 'ios' ? path.replace('file://', '') : path;
            // let imageType = imageDetail.type;
            formdata.append('image', {
                uri: imageDetail.uri,
                type: imageDetail.type,
                name: imageDetail.fileName
            })
        }
        fetch(APP_URL + 'update_profile', {
            method: "POST",
            headers: headers,
            body: formdata
        })
            .then((response) => response.json()).
            then((response) => {
                if (response.status) {
                    getProfile()
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: "Dashboard" }],
                        }));
                    Globalinclude.showToast(response.message)
                    global.global_loader_ref.show_loader(0);
                } else {
                    Globalinclude.showError(response.message)
                    global.global_loader_ref.show_loader(0);
                }
            }).catch((c) => {
                global.global_loader_ref.show_loader(0);
            }).finally((f) => {
                global.global_loader_ref.show_loader(0);
            })
    }
    let callingCode =
        selectedCountry != null ? '+' + selectedCountry.callingCode : '';
    let flagName = selectedCountry != null ? selectedCountry.flag : '';
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Globalinclude.GlobalHeader name={'Edit Profile'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                    }}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View
                        style={styles.parentView}>
                        {!imagePath ? (
                            <TouchableOpacity onPress={() => openFilter()} >
                                <View style={{
                                    height: scale(120),
                                    width: scale(120),
                                    alignSelf: "center",
                                    borderRadius: scale(10)
                                }}>
                                    <ImageBackground
                                        source={Globalinclude.GlobalAssets.placeholderProfile}
                                        style={styles.imgBg}
                                        resizeMode={'cover'}
                                        borderRadius={10}
                                    >
                                        <View
                                            style={styles.cameraBase}>
                                            <Image
                                                source={Globalinclude.GlobalAssets.cameraIcon}
                                                resizeMode={'contain'}
                                                style={styles.cameraIcon}
                                            />
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => openFilter()} >
                                <ImageLoad
                                    borderRadius={10}
                                    style={styles.imgBg}
                                    loadingStyle={{ size: 'small', color: 'blue' }}
                                    source={{ uri: imagePath }}
                                    placeholderSource={Globalinclude.GlobalAssets.placeholderProfile}
                                />
                                <View style={{
                                    marginTop: scale(-70)
                                }}>
                                    <Image
                                        source={Globalinclude.GlobalAssets.cameraIcon}
                                        resizeMode={'contain'}
                                        style={styles.cameraIcon}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                        <View style={{ marginVertical: scale(60) }}>
                            <Globalinclude.GlobalTextBox
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
                            <Globalinclude.GlobalTextBox
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
                            <Globalinclude.GlobalTextBox
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
                                        fontFamily: Globalinclude.GlobalFont.Medium,
                                        fontSize: scale(14),
                                        fontStyle: 'normal',
                                        color: scheme === 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack
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
                                <Globalinclude.GlobalTextBox
                                    placeholder="Enter Number"
                                    onChangeText={value => { setMobileNumber(value); }}
                                    value={mobilenumber}
                                    keyboardType="number-pad"
                                    onSubmitEditing={() => Keyboard.dismiss()}
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
                                            //setSelectedCountry({ code: item.code })
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
                                        style={[styles.errorTextStyle, { color: Globalinclude.GlobalColor.themeColor, fontFamily: Globalinclude.GlobalFont.Medium }]}>
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
                        </View>
                        <View style={{}}>
                            <Globalinclude.GlobalButton text={'Save'}
                                onPress={() => {
                                    validateProfile()
                                }}
                            />
                        </View>
                    </View>
                    {/* Edit Profile Options Modal */}
                    <Modal animationType="fade" transparent={true} visible={filterVisible}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity
                                    onPress={() => openFilter(false)}
                                    style={styles.modalCloseBtn}>
                                    <Image
                                        source={Globalinclude.GlobalAssets.close}
                                        resizeMode={IMG_CONTAIN}
                                        style={{ height: scale(15), width: scale(20) }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={[
                                        styles.modalText,
                                        { color: Globalinclude.GlobalColor.themeColor, marginTop: scale(-30) },
                                    ]}>
                                    Upload Image
                                </Text>
                                <TouchableOpacity
                                    onPress={() => OpenGallery()}
                                    style={styles.optionBase}>
                                    <Text style={styles.modalText}>Choose From Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => OpenCamera()}
                                    style={styles.optionBase}>
                                    <Text style={styles.modalText}>Open Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    imgBg: {
        height: scale(120),
        width: scale(120),
        alignSelf: "center",
        borderRadius: scale(10)
    },
    cameraBase: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: scale(10)
    },
    cameraIcon: { height: scale(22), width: scale(22), alignItems: "center", alignSelf: "center", flex: 1 },
    parentView: {
        marginVertical: scale(30)
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        opacity: 1,
        backgroundColor: '#00000080',
    },
    imageFilterStyle: {
        height: scale(80),
        width: scale(80),
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: scale(50),
    }, modalText: {
        marginTop: 0,
        padding: scale(9),
        textAlign: 'center',
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(15),
        fontStyle: 'normal',
        color: Globalinclude.GlobalColor.themeBlack,
        paddingHorizontal: scale(13),
    },
    message: {
        paddingVertical: scale(5),
        fontSize: scale(18),
        textTransform: 'none',
        paddingHorizontal: scale(12),
    },
    optionBase: {
        marginTop: scale(10),
        elevation: 8,
        shadowColor: Globalinclude.GlobalColor.themeColor,
        shadowRadius: 10,
        shadowOpacity: 1,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    modalCloseBtn: {
        backgroundColor: Globalinclude.GlobalColor.themeColor,
        paddingHorizontal: scale(10),
        paddingVertical: scale(13),
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'white',
        position: 'absolute',
        zIndex: 1,
        right: scale(0),
        top: scale(-15),
    }, flag: {
        width: 20,
        height: 20,
        borderRadius: 0,
    },
    prefix: {
        paddingHorizontal: scale(5),
        fontFamily: Globalinclude.GlobalFont.Medium,
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
        fontFamily: Globalinclude.GlobalFont.Regular,
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(EditProfile);